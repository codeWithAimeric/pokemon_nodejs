const {User} = require('../../db/sequelize')
const auth = require('../../auth/auth')
const { Op } = require('sequelize')

module.exports = (app) => {
    app.get('/api/user/', auth, (req, res) => {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const offset = (page - 1) * limit

        if(req.query.name){
            const name = req.query.name
            if(name.length >  1){
                return User.findAndCountAll({
                    where: {
                        username: {
                            [Op.like]: `%${name}%`
                        }
                    },
                    order: ['username'], 
                    limit: limit
                })
                .then(users => {
                    const message = `Data received successfully ! `
                    res.json({message: message, data: users})
                })
            }else{
                const message = `The name for the request is too short !`
                return res.status(400).json({message: message, data: name})
            }
        }else{
            User.findAndCountAll({
                offset: offset,
                limit: limit
            })
            .then(users => {
                const total = users.count 
                const pageCount = Math.ceil(total / limit)
                let obj = {
                    id: 0,
                    username: ""
                }
                let resTab = []
                for(let i=0; i<users.rows.length; i++){
                    obj.id = users.rows[i].id
                    obj.username = users.rows[i].username
                    resTab.push(obj)
                }
                const response = {
                    page: page,
                    limit: limit, 
                    total: total, 
                    pageCount: pageCount,
                    // users: users.rows
                    users: resTab
                }
                const message = `List user received successfully !`
                res.json({message: message, data: response})
            })
            .catch(error => {
                const message = `Can't get the user's list ! An error occured ! `
                res.json({message: message, data: error})
            })
        }
    })
}