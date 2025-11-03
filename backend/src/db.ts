import  {Pool}  from "pg"

import dotenv from  'dotenv'

dotenv.config();

import { seedExperiences } from "./seeds";

dotenv.config(); 

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})
//pool 

export const initDB =async  ()=>{

    //CREATE TABLES 
    await pool.query(`
        CREATE TABLE IF NOT EXISTS experiences (
            id SERIAL PRIMARY KEY, 
            name VARCHAR(255)  NOT NULL, 
            location  VARCHAR(50) NOT NULL, 
            image   TEXT NOT NULL,
            description TEXT NOT NULL,
            price  NUMERIC(10,2)  ,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(name, location)  
        ); 

        CREATE TABLE IF NOT EXISTS slots (
            id SERIAL PRIMARY KEY, 
            experience_id INT  NOT NULL REFERENCES experiences(id) ON DELETE CASCADE ,
            date DATE  NOT NULL, 
            time TIME(5)  NOT NULL ,
            total_capacity INT NOT NULL ,
            booked_count INT  DEFAULT 0 ,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(experience_id, date, time)
        ); 

         CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY, 
            booking_id VARCHAR(50) UNIQUE,
            slot_id INT NOT NULL REFERENCES slots(id) on DELETE CASCADE,
            name VARCHAR(255)  NOT NULL, 
            email VARCHAR(255)  NOT NULL , 
            quantity INT DEFAULT 1 ,
            promo_code VARCHAR(50),
            total_price DECIMAL(10,2) NOT NULL ,
            discounted_price DECIMAL(10,2)  NOT NULL ,
            final_price DECIMAL(10,2) NOT NULL ,
            status VARCHAR(50) NOT NULL  , 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
         CREATE TABLE IF NOT EXISTS promo_codes (
            id SERIAL PRIMARY KEY, 
            code VARCHAR(255) UNIQUE NOT NULL , 
            discount_price DECIMAL(10,2)  NOT NULL , 
            max_usage INT ,
            used_count INT DEFAULT 0  ,
            is_active BOOLEAN DEFAULT TRUE , 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ); 
    `)

    console.log("tables are created successfully") ; 


    //seeding  db 

    //seeding experiences 

    for (const exp of seedExperiences){

        await pool.query(
            `INSERT INTO experiences(name, location, image, description, price) VALUES($1, $2, $3, $4, $5) ON CONFLICT(name, location) DO NOTHING`, 
            [exp.name, exp.location, exp.image, exp.description, exp.price]  
        );
    }

    console.log("experiences are seeded") ; 

    const today  = new Date() ; 

    for(let i =  1; i<=3 ; i++){
        const date  = new Date(today) ; 
        date.setDate(date.getDate()) + 1 ; 
    }


    // //seeding slots 

    const experiences   = [1,2,3,4,5,6,7,8,9,10,11] ; 
    const times  = ['07:00', '09:00', '11:00', '13:00']

    for(let d = 1 ; d<=5 ; d++){
        const date   = new Date(today) ; 

        date.setDate(date.getDate()+d) ; 

        for(const expId of experiences){
            for(const time of times){
                await pool.query(
                    'INSERT INTO slots (experience_id, date, time, total_capacity, booked_count) VALUES ($1, $2, $3, 10, 0) ON CONFLICT(experience_id, date, time) DO NOTHING',
                    [expId, date.toISOString().split('T')[0], time]
                  );
            }
        }

    }


    console.log('Slots seeded');

    // Seed promo codes
    await pool.query(`
      INSERT INTO promo_codes (code,discount_price, max_usage, is_active)
      VALUES
        ('SAVE10',  10, 100, true),
        ('FLAT100',  100, 50, true),
        ('WELCOME20',  20, 30, true),
        ('SAVE30',  30, 2, true)
      ON CONFLICT(code) DO NOTHING;
    `);

    console.log('Promo codes seeded');


};


        









/*
experiences 
- id 
- image
- name
- location 
- price
- description
- createdAt 


slots 
- id 
- experience_id 
- date 
- time 
- total_capacity
- booked_count
- 


bookings
- id 
- name
- email
- promo_code 
- slot_id 
- quantity
- total
- discounted_price
- final_price
- status 
- created_timestamp 


promo_code 
- id 
- code 
- discounted_price 
- max_usage 
- use_count
- is_active 
- created_at 


*/




