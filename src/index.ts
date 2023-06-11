import { app } from "./app"
import { runDB } from './infrastructure/repositories/db'
import { settings } from "./settings"

const port = settings.PORT

const startApp = async () => {
    await runDB()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
