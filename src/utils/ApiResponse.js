class ApiResponse{
    constructor(
        statusCode,data,massage="success"
    ){
         this.statusCode=statusCode,
         this.massage=massage,
         this.data=data,
         this.success=statusCode<400
    }
}