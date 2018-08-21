const axios = require("axios");
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql')

const customerType = new GraphQLObjectType({
    name:'cust',
    fields: () => ({
        name: {type:GraphQLString},
        age: {type:GraphQLInt},
        email: {type:GraphQLString},
        id: {type:GraphQLString}
    })
});

// const localeType = new GraphQLObjectType({
//     name:'locale',
//     fields: () => ({
//         en: {type:localePageType},
//         ja: {type:localePageType},
//     })
// });

const localePageType = new GraphQLObjectType({
    name:'localePage',
    fields: () => ({
        locale: {type:new GraphQLList(localeVarType)},
    })
});

const localeVarType = new GraphQLObjectType({
    name:'localeVar',
    fields: () => ({
        id: {type:GraphQLString},
        value: {type:GraphQLString},
        pageId: {type:GraphQLString}
    })
});

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: () => ({
        customer: {
            type: customerType,
            args:{
                id: {type:GraphQLString}
            },
            resolve(parentValue, args){
                return axios.get('http://localhost:4200/customers/'+args.id)
                    .then(res => res.data);
            }
        },
        customers:{
            type: new GraphQLList(customerType),
            resolve(parentValue,args){
                //return customers;
                return axios.get('http://localhost:4200/customers')
                    .then(res => res.data);
            }
        },
        locale:{
            type: localePageType,
            args:{
                lang: {type:GraphQLString}
            },
            resolve(parentValue,args){

                if(args.lang=="en"){
                //return customers;
                    return axios.get('http://localhost:3000/locale')
                        .then(res => res.data);
                }
                else{
                    return axios.get('http://localhost:4100/locale')
                        .then(res => res.data);
                }
            }
        },
        localeFilter:{
            type: new GraphQLList(localeVarType),
            args:{
                lang: {type:GraphQLString},
                page: {type:GraphQLString}
            },
            resolve(parentValue,args){
                if(args.lang=="en"){
                //return customers;
                    return axios.get('http://localhost:3000/pages/'+args.page+'/locale/')
                        .then(res => res.data);
                }
                else{
                    return axios.get('http://localhost:4100/pages/'+args.page+'/locale/')
                        .then(res => res.data);
                }
            }
        }
    })
});

const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addCustomer:{
            type:customerType,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)},
                email:{type: new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue,args){
                return axios.post('http://localhost:4200/customers',{
                    name:args.name,
                    age:args.age,
                    email:args.email
                }).then(res => res.data);
            }
        },
        deleteCustomer:{
            type:customerType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parentValue,args){
                return axios.delete('http://localhost:4200/customers/'+args.id).then(res => res.data);
            }
        },
        editCustomer:{
            type:customerType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                name:{type: GraphQLString},
                email:{type: GraphQLString},
                age:{type: GraphQLInt}
            },
            resolve(parentValue,args){
                return axios.patch('http://localhost:4200/customers/'+args.id,args).then(res => res.data);
            }
        }
    }

})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:mutation
});