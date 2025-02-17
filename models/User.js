import mongoose from 'mongoose';

const userSchema = new mongoose.schema({
    name: String,
    email: String,
    age: Number,
})

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;