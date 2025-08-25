import { Model, DataTypes, Sequelize } from 'sequelize';
import { IUser } from '../types';

interface UserModel extends Model<IUser>, IUser {}

export default (sequelize: Sequelize) => {
    class User extends Model<IUser, Omit<IUser, 'id'>> implements IUser {
        public id!: number;
        public email!: string;
        public password!: string;
        public firstName!: string;
        public lastName!: string;
        public address!: string;
        public phoneNumber!: string;
        public gender!: boolean;
        public roleId!: string;

        static associate(models: any) {
            // define association here
        }
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        roleId: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        freezeTableName: true
    });

    return User;
};
