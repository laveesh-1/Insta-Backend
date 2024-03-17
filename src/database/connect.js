import { Sequelize } from "sequelize";
import dbconf from "../configs/dbconfig.js";

const sequelize=new Sequelize(
    dbconf.name,
    dbconf.user,
    dbconf.pass,
    {
        dialect:"mysql",
        host:"localhost"
    }
)

export default sequelize