import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Ambulances 스키마
const ambulanceSchema = new mongoose.Schema({
  amblrescd: String,
  ambltypcd: String,
  carMafYea: String,
  carSeq: String,
  carKndNam: String,
  dutyAddr: String,
  dutyName: String,
  onrAdr: String,
  onrNam: String,
  onrTel: String,
  onrZipCod: String,
  oprEmogcode: String,
  regday: String,
  rnum: String,
  latitude : String,
  longitude : String
});

const Ambulance = mongoose.model('Ambulance', ambulanceSchema);

export { Ambulance };




