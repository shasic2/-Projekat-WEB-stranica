module.exports=(sequelize,DataTypes)=>{
    const Nekretnina = sequelize.define('nekretnina',{

        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        tip_nekretnine: {
            type: DataTypes.STRING,
            allowNull: false
        },
        naziv: {
            type: DataTypes.STRING,
            allowNull: false
        },
        kvadratura: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cijena:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        tip_grijanja:{
            type:DataTypes.STRING,
            allowNull:false
        },
        lokacija:{
            type:DataTypes.STRING,
            allowNull:false
        },
        godina_izgradnje:{
            type:DataTypes.STRING,
            allowNull:false
        },
        datum_objave:{
            type:DataTypes.STRING,
            allowNull:false
        },
        opis:{
            type:DataTypes.STRING,
            allowNull:false
        }, 
     


    },{freezeTableName:true});
    return Nekretnina;
}

