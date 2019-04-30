function moment(createdAt){
  
    let result;
    const fromNow = Date.now() - createdAt
    
     switch(true){
    
      case fromNow >= 1000 && fromNow <= 60000 :
      result = `${Math.ceil(fromNow/1000)} seconds ago`;
      break;
       
      case fromNow >= 60000 && fromNow <= 3.6e+6 :
      result = `${Math.ceil(fromNow/60000)} Minutes ago`;
      break;
      
      case fromNow >= 8.64e+7 && fromNow <= 6.048e+8 :
      result = `${Math.ceil(fromNow/8.64e+7)} Weeks ago`;
      break;
      
      case fromNow >= 2.628e+9 && fromNow <= 3.154e+10 :
      result = `${Math.ceil(fromNow/2.628e+9)} Years ago`;
      break;
      default:
      // custom console
      // eslint-disable-next-line no-console
      console.log("Created before the dawn of time");
      break;
      
    }   
    return result
  }
  
module.exports = moment
