require('dotenv').config();

exports.createUser = (req, resp) => { 
    const body = req.body;
    
    return resp.json({ body });
};

exports.updateUser = (req, resp) => { 
    const body = req.body;
    
    return resp.json({ body });
};  


exports.getUser = (req, resp) => { 
    const body = req.body;
    
    return resp.json({ body });
};

exports.getFilteredUser = (req, resp) => {
    const body = req.body;

    return resp.json({ body });
};
