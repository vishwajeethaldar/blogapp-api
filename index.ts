import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
import routes from './routes'
import dbConnect from "./src/db/config"


const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({extended: true}))


app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
}))

app.get('/', (req, res) =>{
    res.sendFile(`${__dirname}/index.html`)
})

function main(){
    app.listen(process.env.PORT||8080, async() => {
        await dbConnect()
        console.log('server started on port 8080')
    })
    routes(app)
}
main()

