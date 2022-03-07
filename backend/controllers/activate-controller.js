const Jimp = require('jimp');
const path = require('path');
const userService = require('../services/user-service');
const UserDto = require('../dtos/user-dto');

class ActivateController {
    async activate(req, res) {
        // Activation logic
        const { name, profile } = req.body;
        if (!name|| !profile) {
            res.status(400).json({ message: 'All fields are required!' });
            return;
        }

        // Image Base64
       
        const buffer = Buffer.from(profile.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
        
        // 32478362874-3242342342343432.png
           // console.log('name');
        try {
            const jimResp = await Jimp.read(buffer);
            //console.log('sd');
            jimResp
                .resize(150, Jimp.AUTO)
                .write(path.resolve(__dirname, `../storage/${imagePath}`));
                console.log('saved');
        } catch (err) {
            res.status(500).json({ message: 'Could not process the image' });
            return;
       }

        const userId = req.user._id;
        // Update user
        try {
            const user = await userService.findUser({ _id: userId });
            if (!user) {
                res.status(404).json({ message: 'User not found!' });
            }
            user.activated = true;
            user.name = name;
            user.profile = `/storage/${imagePath}`;
            user.save();
            res.json({ user: new UserDto(user), auth: true });
        } catch (err) {
            res.status(500).json({ message: 'Something went wrong!' });
        }
    }
}

module.exports = new ActivateController();