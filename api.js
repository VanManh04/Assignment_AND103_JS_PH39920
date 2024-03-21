const express = require('express');
const motorModel = require('./model/motorModel')
const router = express.Router();

module.exports = router;
const server = require('./server');
const { default: mongoose } = require('mongoose');

router.get('/', (req, res) => {
    res.send('URI:' + app.uri);
    res.send('vào api mobile');
});

router.get('/list', async (req, res) => {
    await server.mongoose.connect(server.uri);

    let motors = await server.mtModel.find();

    console.log(motors);

    res.send(motors);
});

//add motor
router.post('/motor/add', async (req, res) => {
    await mongoose.connect(server.uri);
    try {
        const data = req.body;

        const newMotor = new server.mtModel({
            name: data.name,
            brand: data.brand,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: data.image
        })

        const result = await newMotor.save()

        if (result) {
            res.json({
                "status": "200",
                "messenger": "Thêm thành công",
                "data": result,
            });
        } else {
            res.json({
                "status": "400",
                "messenger": "Lỗi, thêm không thành công",
                "data": [],
            });
        }
    } catch (error) {
        console.error('Lỗi khi thêm:', error);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
});

// delete motor
router.delete('/motor/delete/:id',async (req,res)=>{
    const {id} = req.params;
    const result = await motorModel.deleteOne({_id: id});
    if(result){
        res.json({
            "status" : "200",
            "messenger" : "Delete student success",
            "data" : result
        })
    }else{
        res.json({
            "status" : "400",
            "messenger" : "Delete fail",
            "data" : []
        })
    }
})

// update motor
router.put('/motor/update/:id', async (req, res) => {
    try {
        await mongoose.connect(server.uri);

        const id = req.params.id;
        const data = req.body;

        const updateMotor = await motorModel.findByIdAndUpdate(id, data, { new: true });

        if (!updateMotor) {
            return res.status(404).send('Motor không tồn tại');
        }

        res.json({
            "status": 200,
            "messenger": "Cập nhật thành công",
            "data": updateMotor
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật:', error);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
});