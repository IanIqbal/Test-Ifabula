const { User, Company, Item, Transaction, sequelize } = require("../models")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const csv = require("csv-stringify")

class Controller {
    static test(req, res) {
        try {
            res.status(200).json("test")
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static async login(req, res) {
        try {

            const { username, password } = req.body

            if (!username || !password) {
                throw { status: 400, message: "all input required" }
            }


            const user = await User.findOne({ where: { username } })

            if (!user) {
                throw { status: 401, message: "invalid username/password" }
            }

            const checkPassword = bcrypt.compareSync(password, user.password)

            if (!checkPassword) {
                throw { status: 401, message: "invalid username/password" }
            }

            const access_token = jwt.sign({ id: user.id }, "12345")

            res.status(201).json({ access_token })

        } catch (error) {
            res.status(500).json(error)
        }
    }

    static async createTransaction(req, res) {
        const t = await sequelize.transaction()
        try {

            const { code, companyName, itemName, totalItem } = req.body

            const company = await Company.findOne({ where: { code, name: companyName } }, { transaction: t })

            if (!company) {
                throw { status: 404, message: "company not found" }
            }

            const item = await Item.findOne({ where: { name: itemName } }, { transaction: t })

            if (!item) {
                throw { status: 404, message: "item not found" }
            }
            let calculateStock = item.stock - totalItem
            if (calculateStock < 0) {
                throw { status: 400, message: "item stock is not enough" }
            }

            let updatedItem = await Item.update({ stock: calculateStock }, { where: { id: item.id }, returning: ["*"] }, { transaction: t })

            const transaction = await Transaction.create({ companyName, itemName, totalItem, itemPrice: item.price, grandTotal: item.price * totalItem, stockReserve: updatedItem[1][0].dataValues.stock, CompanyId: company.id, ItemId: item.id }, { transaction: t })

            t.commit()
            // console.log(updatedItem[1][0].dataValues);
            let date = updatedItem[1][0].dataValues.createdAt
            // let output = {}
            let inputDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
            console.log(inputDate);

            const csvFile = fs.createWriteStream(`transaction-${transaction.id}.csv`)
            csv.stringify([{ tInput: inputDate, nCompany: companyName, nItem: itemName, tItem: totalItem, iPrice: item.price, gTotal: item.price * totalItem, sReserve: updatedItem[1][0].dataValues.stock }], { header: true, columns: { tInput: "Tanggal Input", nCompany: "Nama Perusahaan", nItem: "Nama Barang", tItem: "Total Barang", iPrice: "Harga Barang", gTotal: "Grand Total", sReserve: "Sisa Barang" } }, (err, output) => {
                csvFile.write(output)
            })
            res.status(201).json({ transaction: [["Tanggal Input", "Nama Perusahaan", "Nama Barang", "Total Barang", "Harga Barang", "Grand Total", "Sisa Barang"], [inputDate, companyName, itemName, totalItem, item.price, item.price * totalItem, updatedItem[1][0].dataValues.stock]] })
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static async getUsers(req, res) {
        try {
            let users = await User.findAll({ attributes: ["username", "password"] })

            res.status(200).json(users)
        } catch (error) {
            res.status(500).json(error)

        }
    }

    static async getUserDetail(req, res) {
        try {

            let { id } = req.params

            let user = await User.findByPk(id)

            if (!user) {
                throw { status: 404, message: "User not found" }
            }
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)

        }
    }

    static finonacciOddOnly(req, res) {

        let num = +req.body.num

        let arr = []
        let originalNum = num
        if(num < 4){
            num+=1
        }
    
        for (let i = 0; i < num; i++) {
    
    
            if (arr.length > 1) {
                if (i % 2 == 0) {
                    num++
                }
                arr.push(arr[arr.length - 1] + arr[arr.length - 2])
            } else {
    
                arr.push(i)
            }
        }
    
        let output = arr.filter(el => el % 2 != 0)
        let sorted = output.sort((a, b) => b - a)
    
        if(sorted.length > originalNum){
           sorted =  sorted.slice(sorted.length-originalNum)
        }

        res.status(201).json(sorted)
    }

    static longestWordInsideWord(req,res){

        let {input} = req.body

        let alphabet = "abcdefghijklmnopqrstuvwxyz"
        let same = []
        
            let temp = ""
            for (let j = 0; j < input.length; j++) {
    
                temp += input[j]
    
                if(alphabet.includes(temp)){
                    same.push(temp)
                }else {
                    temp = ""
                    temp += input[j]
                }
            }
    
        let sorted = same.sort((a,b) => b.length-a.length)[0].length
    
        res.status(201).json(sorted)

    }
}

module.exports = Controller