class APIFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
       let keyword =  this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
       }: {};

       this.query.find({...keyword})
       return this;
    }
    categoryFilter() {
        if (this.queryStr.mealTypeCategory) {
            this.query.where('mealTypeCategory').equals(this.queryStr.mealTypeCategory);
        }
        if (this.queryStr.dietaryPreferenceCategory) {
            this.query.where('dietaryPreferenceCategory').equals(this.queryStr.dietaryPreferenceCategory);
        }
        if (this.queryStr.isPreOrderAvailable !== undefined) {
            this.query.where('isPreOrderAvailable').equals(this.queryStr.isPreOrderAvailable);
        }
        if (this.queryStr.restaurantId) {
            this.query.where('restaurantId').equals(this.queryStr.restaurantId);
          }
        return this;
    }

    filter(){
        const queryStrCopy = { ...this.queryStr };
  
        //removing fields from query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach( field => delete queryStrCopy[field]);
        
        let queryStr = JSON.stringify(queryStrCopy);
        queryStr =  queryStr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`)

        this.query.find(JSON.parse(queryStr));

        return this;
    }

    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1)
        this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = APIFeatures;