const express = require("express");
const jwtGenerator = require("../utils/jwtGenerator")
var cors = require('cors')
const pool = require("./db");
const authorize = require("../middleware/authorize")
const app = express();
app.use(express.json());
app.use(cors())

app.post("/SignUp", async (req, res) => {
    const { user_name, email } = req.body;
    await pool.query(
        `SELECT * FROM users
        WHERE user_name = $1 OR email = $2`,
        [user_name, email],
        async (err, results) => {
            if (err) {
                console.log(err);
            } if (results.rows.length > 0) {
                if (results.rows[0].user_name === req.body.user_name) {
                    res.json({ status: "SIGNUP", message: "UserName Alrady Exist" });
                }
                if (results.rows[0].email === req.body.email) {
                    res.json({ status: "SIGNUP", message: "Email Alrady Exist" });
                }
            } else {
                try {
                    const { user_name, email, password } = req.body;
                    const newUser = await pool.query(
                        "INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *",
                        [user_name, email, password]
                    );

                    res.json("Account successfully created");
                } catch (err) {
                    console.log(err.message);
                }
            }
        })
});

app.post("/Login", async (req, res) => {

    const { email, password } = req.body;
    await pool.query(
        `SELECT * FROM users
        WHERE user_name =$1 OR email = $2`,
        [email, email],
        (err, results) => {
            if (err) {
                console.log(err);
            }
            if (results.rows.length > 0) {
                if (results.rows[0].password !== req.body.password) {
                    res.json({ message: "Please Enter Correct Password" });
                }
                else {
                    const jwtToken = jwtGenerator(results.rows[0].id);
                    res.json({ token: jwtToken, status: "LOGIN" });
                }
            } else {
                res.json({ message: "Sorry Please Registar Now" });
            }
        })
});

app.post("/AddShop", authorize, async (req, res) => {
    const { contact_number } = req.body;

    await pool.query(
        `SELECT * FROM shops
        WHERE contact_number = $1`,
        [contact_number],
        async (err, results) => {
            if (err) {
                console.log(err);
            } if (results.rows.length > 0) {

                if (results.rows[0].contact_number === req.body.contact_number) {
                    res.json({ status: "SIGNUP", message: "contact_number Alrady Exist" });
                }
            } else {
                try {
                    const { shop_type, shop_name, proprietor, contact_number, shop_level, shop_address, star_rating, shop_photos } = req.body;
                    const newShop = await pool.query(
                        "INSERT INTO shops (shop_type, shop_name, proprietor, contact_number, shop_level, shop_address, star_rating, shop_photos) VALUES ($1, $2, $3, $4 ,$5, $6, $7, $8) RETURNING *",
                        [shop_type, shop_name, proprietor, contact_number, shop_level, shop_address, star_rating, shop_photos]
                    );

                    res.json({ message: "successfully Add Shop", status: 'ShopAdd' });
                } catch (err) {
                    console.log(err.message);
                }
            }
        })
});

app.get("/ShopDetails", authorize, async (req, res) => {
    try {
        const Login_Data = await pool.query("SELECT * FROM shops order by shop_id");
        res.json(Login_Data.rows);
    } catch (err) {
        console.log(err.message);
    }
});

app.get("/EditShopDetails/:shop_id", authorize, async (req, res) => {
    try {
        const { shop_id } = req.params;
        const Login_Data = await pool.query("SELECT * FROM shops WHERE shop_id = $1", [shop_id]);
        res.json(Login_Data.rows);
    } catch (err) {
        console.log(err.message);
    }
});


app.put("/EditShopDetail/:shop_id", authorize, async (req, res) => {
    try {
        const { shop_id } = req.params;
        const { shop_type, shop_name, proprietor, contact_number, shop_level, shop_address, star_rating, shop_photos } = req.body;
        const editShopDetail = await pool.query(
            "UPDATE shops SET shop_type = $1, shop_name = $2, proprietor = $3, contact_number = $4, shop_level = $5, shop_address = $6, star_rating = $7, shop_photos = $8 WHERE shop_id = $9 ",
            [shop_type, shop_name, proprietor, contact_number, shop_level, shop_address, star_rating, shop_photos, shop_id]
        );
        res.json({ message: "Success Edit", status: 'ShopDetailEdit' });
    } catch (err) {
        console.log(err.message);
    }


});

app.delete("/DeleteShop/:shop_id", authorize, async (req, res) => {
    try {
        const { shop_id } = req.params;
        await pool.query("DELETE FROM shops  WHERE shop_id = $1 ", [shop_id]);
        res.json({ message: "Delete successfuuly" });
    } catch (err) {
        console.log(err.message);
    }
});
app.listen(9000, () => {
    console.log("server is listening on port 9000");
});
