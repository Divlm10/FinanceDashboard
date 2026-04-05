const roleGuard=(...allowedRoles)=>{
    return (req,res,next)=>{
        if(!res.user){
            return res.status(401).json({
                success: false,
                message: "Unauthenticated",
            });
        }
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions",
            });
        }
        next();//role matched->continue
    };
};

export default roleGuard;