const TierDashboard=(userTier:any)=>{
    const tiers=[
    {tier:1 ,min:0, max:50, rate:0.68},
    {tier:2 , min: 51, max: 100, rate: 0.78 },
    {tier:3 , min: 101, max: 200, rate: 0.95 },
    {tier:4 , min: 201, max: 350, rate: 1.55 },
    {tier:5 , min: 351, max: 650, rate: 1.95 },
    {tier:6 , min: 651, max: 1000, rate: 2.10 },
    {tier:7 , min: 1001, max: Infinity, rate: 2.58 }

];
    return (
        <>
            
            {
                tiers.map((ele:any, index:number)=>(
                    <div className="">

                    </div>
                )
                    
                )
            }

        </>
    );
}

export default TierDashboard;