import bcrypt from 'bcrypt';
import db from '../models';
import { IUser, IUserRequestBody, ICRUDService } from '../types';

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });
};

const createNewUser = async (data: IUserRequestBody): Promise<string> => {
    try {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
            email: data.email,
            password: hashPasswordFromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address || null,
            phoneNumber: data.phoneNumber || null,
            gender: data.gender === '1' ? true : (data.gender === '0' ? false : null),
            roleId: data.roleId || null,
        });
        return 'User created successfully';
    } catch (error) {
        throw error;
    }
};

const getAllUsers = async (): Promise<IUser[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,
            });
            resolve(users as IUser[]);
        } catch (error) {
            reject(error);
        }
    });
};

const getUserInfoById = (userId: string): Promise<IUser | null> => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            });
            resolve(user as IUser | null);
        } catch (error) {
            reject(error);
        }
    });
};

const updateUser = (data: IUserRequestBody & { id: string }): Promise<IUser[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address || null;
                user.phoneNumber = data.phoneNumber || null;
                user.gender = data.gender === '1' ? true : (data.gender === '0' ? false : null);
                user.roleId = data.roleId || null;
                await user.save();
                let allUsers = await db.User.findAll({
                    raw: true,
                });
                resolve(allUsers as IUser[]);
            } else {
                reject(new Error('User not found'));
            }
        } catch (error) {
            reject(error);
        }
    });
};

const deleteUser = (userId: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            });
            if (user) {
                await user.destroy();
                resolve();
            } else {
                reject(new Error('User not found'));
            }
        } catch (error) {
            reject(error);
        }
    });
};

const CRUDService: ICRUDService = {
    createNewUser,
    getAllUsers,
    getUserInfoById,
    updateUser,
    deleteUser
};

export default CRUDService;
