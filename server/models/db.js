const mongoose = require("mongoose");
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const schema = require('./schema');
const schemaUsers = schema.User;
const schemaNews = schema.News;
const schemaChat = schema.Chat;


const isNotValidUser = data => {
    let isName = !!data.username;
    let isPassword = !!data.password;
    return !isName || !isPassword;
};

const isNotValidNews = data => {
    let isText = !!data.text;
    return !isText;
};

module.exports.getUsers = function () {
    return schemaUsers.find()
};

module.exports.saveNewUser = function (data) {
    if (isNotValidUser(data)) {
        return Promise.reject(new Error('Data format is not correct'))
    }
    const User = new schemaUsers ({
        access_token: uuidv1(),
        id: uuidv4(),
        username: data.username,
        surName: data.surName || '',
        firstName: data.firstName || '',
        middleName: data.middleName || '',
        permission: data.permission,
        permissionId: uuidv4(),
        password: data.password,
        image: data.img || ''
    });

    return User.save()
};

module.exports.updateUser = function (data, user, paramsId) {
    const User = {};
    User.surName = data.surName ? data.surName : user.surName;
    User.firstName = data.firstName ? data.firstName : user.firstName;
    User.middleName = data.middleName ? data.middleName : user.middleName;
    User.image = data.image ? data.image : user.image;
    User.password = data.password ? data.password : user.password;
    return schemaUsers.findByIdAndUpdate ({
        '_id': paramsId
    }, {
        $set: User
    }, {new: true})
};

module.exports.deleteUser = function (paramsId) {
    return schemaUsers.findByIdAndRemove({'_id': paramsId})
};

module.exports.updateUserAccess = function (user) {
    const newAccess = uuidv1();
    return schemaUsers.findOneAndUpdate({id: user.id}, {access_token: newAccess}, {
        multi: true,
        returnNewDocument: true,
        new: true
    })
};
