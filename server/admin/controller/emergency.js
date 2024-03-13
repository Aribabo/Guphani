import * as emergencyData from '../data/emergency.js';

export async function getErList(req, res) {
    const result = await emergencyData.getAllCitiesEr();
    res.send(result);
    
}
export async function getErInfo(req, res) {
    try {
        const result = await emergencyData.getAllInfoEr();
        res.send(result);
    } catch (error) {
        console.error("에러 발생", error);
        res.status(500).send("Internal Server Error");
    }
}

export async function getOneErInfo(req, res) {
    const result = await emergencyData.getOneEr();
    res.send(result)
    // console.log(result);
    
}
export async function getSpecialEr(req, res) {
    const result = await emergencyData.insertSpecialEr();
    res.send(result)
    
}
export async function getSaltCode(req, res) {
    const result = await emergencyData.insertSaltCode();
    res.json(result)
    
}
export async function getEquipment(req, res) {
    const result = await emergencyData.insertEquipment();
    res.json(result)
    
}
