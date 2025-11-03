import express, { Express, Request, Response } from "express";
import { initDB, pool } from "./db";
import cors from "cors";
const app: Express = express();

const PORT = 5000;

//middlewares
app.use(express.json());
app.use(cors());



interface BookingRequest {
   slot_id: number;
   name: string;
   email: string;
   promo_code?: string;
   total_price: number;
 }
 
 interface Experience {
   id: number;
   name: string;
   location: string;
   description: string;
   price: number;
   image: string;
 }
 
 interface PromoValidateRequest {
   promo_code: string;
   total_price: number;
 }


app.get("/api/experiences", async (req : Request, res:Response) => {
  try {
    const result = await pool.query("SELECT *  FROM experiences");

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

app.get("/api/experience/:id", async (req:Request, res:Response) => {
  try {
    const expId = req.params.id;

    const expResult = await pool.query(
      "SELECT * FROM experiences WHERE  id = $1",
      [expId]
    );

    if (expResult.rows.length === 0) {
      return res.status(404).json({ error: "Experience not found" });
    }

    const slotResult = await pool.query(
      "SELECT id, date, time, total_capacity, booked_count, total_capacity-booked_count as available_count FROM slots WHERE experience_id  =  $1",
      [expId]
    );

    return res.status(200).json({
      ...expResult.rows[0],
      slots: slotResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

app.post("/api/bookings", async (req:Request, res:Response) => {
  try {
    const { slot_id, name, email, total_price, promo_code } = req.body;

    //input valition

    if (!slot_id || !name || !email || total_price === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate email format (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate name not empty
    if (name.trim() === "") {
      return res.status(400).json({ error: "Name cannot be empty" });
    }

    //slot availbility

    const result = await pool.query(
      "SELECT  total_capacity, booked_count  FROM slots WHERE id =  $1",
      [slot_id]
    );

    //check if the slot is even there in db
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "slot not found" });
    }

    const slot = result.rows[0];

    if (slot.booked_count >= slot.total_capacity) {
      return res.status(400).json({ error: "slot is full. Try another" });
    }

    //double booking check

    const existbookingResult = await pool.query(
      `SELECT * FROM bookings where email=$1 and slot_id=$2 `,
      [email, slot_id]
    );

    if (existbookingResult.rows.length !== 0) {
      return res.status(404).json({
        error: "Duplicate Slot booking for same user is not allowed. ",
      });
    }

    //validate promo code

    let discounted_price = 0;
    let final_price = total_price;
    if (promo_code) {
      const promocodeResult = await pool.query(
        "SELECT * FROM promo_codes WHERE code = $1 and is_active = true",
        [promo_code]
      );

      if (promocodeResult.rows.length === 0) {
        return res.status(404).json({ error: "Invalid promo code" });
      }

      const code = promocodeResult.rows[0];

      if (code.used_count >= code.max_usage) {
        return res.status(400).json({
          error:
            "{Promo code reached it max usage. It no longer valid. Try another code.",
        });
      }

      //calculate discount
      discounted_price = code.discount_price;

      final_price = Math.max(0, total_price - discounted_price);

      //update the usage of the promo code
      await pool.query(
        "UPDATE promo_codes SET used_count = used_count+1 where id = $1",
        [code.id]
      );


      //update the status of the prmo code 
      if (code.used_count + 1 >= code.max_usage) {
         await pool.query(
           'UPDATE promo_codes SET is_active = false WHERE id = $1',
           [code.id]
         );
       }
    }

    //create booking
    const bookingId = 'HUF' + Math.random().toString(36).substring(2, 11).toUpperCase();


    const bookingResult = await pool.query(
      `
      INSERT INTO bookings (booking_id, name, email, slot_id, total_price, discounted_price, final_price, promo_code , status) 
      VALUES($1, $2, $3, $4, $5 ,$6,$7,$8,'confirmed') 
      RETURNING * 
      `,
      [
        bookingId,
        name,
        email,
        slot_id,
        total_price,
        discounted_price,
        final_price,
        promo_code || null,
      ]
    );

    //update slot booked count

    await pool.query(
      "UPDATE slots SET booked_count = booked_count+1 WHERE id = $1",
      [slot_id]
    );

    res.status(201).json({
      success: true,
      booking: bookingResult.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/api/promo/validate" ,async (req:Request , res:Response)=>{

   const  {promo_code, total_price}  = req.body  ; 

   if(!promo_code || total_price ===undefined){
      return res.status(400).json({error : "MIssing code or price"}) ; 
   }

   const promoResult  = await pool.query('SELECT * FROM promo_codes WHERE code = $1 AND   is_active=true ', [promo_code]) ; 

   if(promoResult.rows.length ===0) {
      return res.status(404).json({error : "promo code not found or expired."}) ; 
   }

   const promo = promoResult.rows[0] ; 

   if(promo.used_count >= promo.max_usage){
      return res.status(400).json({err : "promo code is no longer valid. Try another!"})
   }


   let discount_price  = 0; 

   discount_price  = promo.discount_price ; 

   let final_price  = Math.max(0, total_price - discount_price) ; 

   res.json({
      valid : true , 
      discount_price , 
      final_price
   })

})

app.listen(PORT, async () => {
  try {
    await initDB();
    console.log(`Server is running on ${PORT}`);
  } catch (err) {
    console.error("Failed to initliaze database", err);
    process.exit(1);
  }
});
