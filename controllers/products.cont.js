const Product = require('../models/product.mode')

const getAllProductsStatic = async(req,res) =>{
    const products = await Product.find({})
    res.status(200).json({nbHits:products.length, products})
}

const getAllProduc = async(req,res) =>{
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}
    if(featured){
        queryObject.featured = featured === 'true' ? true : false
    }
    if(company){
        queryObject.company = company 
    }
    if(name){
        queryObject.name = {$regex: name, $options: 'i' }
    }

    if(numericFilters){
        const operatoMap = {
            '>'  : '$gt',
            '>=' : '$gte',
            '='  : '$eq',
            '<'  : '$lt',
            '<=' : '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regEx,(match)=>`-${operatoMap[match]}-`)

        const options = ['price','rating']
        console.log(filters)
        filters = filters.split(',').forEach((item) => {
            const [field,operator,value] = item.split('-')
            if(options.includes(field)){
                queryObject[field]={[operator]:Number(value)}
            }
        })
    }

    let result = Product.find(queryObject)
    const profuctLenght = await Product.countDocuments(queryObject);
    
    // sort
    if(sort){
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)                                           
    }else{
        result = result.sort('createAT')                                           
    }

    if(fields){
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList) 
    }
    
    let limit  = parseInt(req.query.limit)  || 10;

    if(req.query.limit == "max"){
        limit = profuctLenght
    }
    if(req.query.limit > profuctLenght){
        limit = 10
    }
    
    result = result.limit(limit)

    const products = await result
    res.status(200).json({nbHits:products.length, products})
    

}

module.exports = {
    getAllProductsStatic,
    getAllProduc
}
