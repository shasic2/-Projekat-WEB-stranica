module.exports=(sequelize,DataTypes)=>{
    const Korisnik = sequelize.define('korisnik',{

        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        ime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        prezime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        }

    },{freezeTableName:true});
    return Korisnik;
}

