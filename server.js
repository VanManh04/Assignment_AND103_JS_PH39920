
const express = require('express');
const mtModel = require('./model/motorModel');
const mongoose = require('mongoose');
const Upload = require('./config/common/upload')//up anh

const app = express();

const port = 3000;
app.listen(port, () => {
    console.log(`Server dang chay cong ${port}`)
})

const api = require('./api');
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use ('/api', api);

const uri = 'mongodb+srv://manhgvph39920:H.Ni2iX2s%23n3QxC@cluster0.o90prmy.mongodb.net/MyDatabase_1';

app.get('/', async(req,res) => {
    await mongoose.connect(uri);
    let mt = await mtModel.find();
    // console.log(mt);
    res.send(mt);
})

// danh sách motor
app.get('/list-motor', async (req, res) => {
    try {
        await mongoose.connect(uri);
        let motor = await mtModel.find();
        res.json({
            "status": "200",
            "messenger": "Danh sách motor",
            "data": motor
        })
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
})

// lấy motor theo id
app.get('/list-motor-by-id/:id', async (req, res) => {
    try {
        await mongoose.connect(uri);
        const id = req.params.id
        let data = await mtModel.findById(id);
        res.json({
            "status": "200",
            "messenger": `lấy theo ID: ${id}`,
            "data": data
        })
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
});

// thêm motor
app.post('/add-motor', async (req, res) => {
    await mongoose.connect(uri);
    try {
        const data = req.body;

        const newMotor = new mtModel({
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

// xóa motor
app.delete('/delete-motor/:id', async (req, res) => {
    try {
        await mongoose.connect(uri);

        let id = req.params.id;
        let result = await mtModel.deleteOne({ _id: id });

        if (result) {
            res.json({
                "status": 200,
                "messenger": "Xóa thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, xóa không thành công",
                "data": []
            });
        }
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
});

// update motor
app.put('/update-motor/:id', async (req, res) => {
    try {
        await mongoose.connect(uri);

        const id = req.params.id;
        const data = req.body;

        const updateMotor = await mtModel.findByIdAndUpdate(id, data, { new: true });

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

//upload ảnh
app.post('/upload-image', Upload.array('image', 5), async (req, res) => {
    await mongoose.connect(uri);

    try {
        const data = req.body;
        const files = req.files;
        console.log(JSON.stringify(data));

       

        // const urlImages = files.map(file => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
        const urlImages = files.map(file => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);

        const newMotor = new mtModel({
            name: data.name,
            brand: data.brand,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: urlImages,
        });

        const result = await newMotor.save();

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
        console.log(error);
        res.status(500).json({
            "status": "500",
            "messenger": "Lỗi máy chủ nội bộ",
            "data": [],
        });
    }
});
exports.uri = uri;
exports.mongoose = mongoose;
exports.mtModel = mtModel;