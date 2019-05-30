function moment(createdAt){
  
    let result;
    const fromNow = Date.now() - createdAt
    
     switch(true){
    
      case fromNow >= 1000 && fromNow <= 59000 :
      result = `${Math.ceil(fromNow/1000)} seconds ago`;
      break;
       
      case fromNow >= 60000 && fromNow <= 3.54e+6 :
      result = `${Math.ceil(fromNow/60000)} Minutes ago`;
      break;
 
      case fromNow >= 3.6e+6 && fromNow <= 8.64e+7 :
      result = `${Math.ceil(fromNow/3.6e+6 )} Hours ago`;
      break;      
       
      case fromNow >= 8.64e+7 && fromNow <= 6.048e+8 :
      result = `${Math.ceil(fromNow/8.64e+7)} Days ago`;
      break;
      
      case fromNow >= 6.048e+8 && fromNow <= 2.628e+9 :
      result = `${Math.ceil(fromNow/6.048e+8)} Weeks ago`;
      break;

      case fromNow >= 2.628e+9 && fromNow <= 3.154e+10 :
      result = `${Math.ceil(fromNow/2.628e+9)} Months ago`;
      break;

      case fromNow >= 3.154e+10 :
      result = `${Math.ceil(fromNow/2.628e+9)} years ago`;
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
