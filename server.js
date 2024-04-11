const express = require("express")
const {notFound} = require("./middleware/notFound")
const authRouter = require("./routes/authRoutes")
const morgan = require("morgan")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { PORT } = require("./config/constants")
const { errHandler } = require("./middleware/errHandler")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(morgan("dev"))
app.use(cors({
    origin : "*"
}))
app.use(cookieParser())

app.get("/", (req, res)=>{
   res.status(200).json({
    message : "Home page"
   })
})
app.use("/auth", authRouter)

app.use(notFound)
app.use(errHandler)

const startApp = ()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is listening on port ${PORT}`)
    })
}

startApp()