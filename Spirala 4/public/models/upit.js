module.exports=(sequelize,DataTypes)=>{
    const Upit = sequelize.define('upit',{

        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        korisnik_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tekst_upita: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nekretninaId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{freezeTableName:true});
    return Upit;
}

