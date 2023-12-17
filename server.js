const express = require("express")
require("dotenv").config()
const {notFound} = require("./middleware/notFound")
const authRouter = require("./routes/authRoutes")
const morgan = require("morgan")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(morgan("dev"))

app.get("/", (req, res)=>{
   res.status(200).json({
    message : "Home page"
   })
})
app.use("/auth", authRouter)

app.use(notFound)

const PORT = process.env.PORT

const startApp = ()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is listening on port ${PORT}`)
    })
}

startApp()