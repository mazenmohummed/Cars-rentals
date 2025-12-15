"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getUsersAction = async () =>{
    return await prisma.user.findMany()
};
export const creatUsersAction = async () =>{};
export const updateUsersAction = async () =>{};
export const deleteUsersAction = async () =>{};