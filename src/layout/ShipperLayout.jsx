import { useSelector } from "react-redux";
import ShipperHeader from '../components/shipper/ShipperHeader'
import { getShop } from "../api/shopApi";
import Loading from "../module/client-module/loading/Loading";
import { useMutation, useQuery } from "@tanstack/react-query";

const ShipperLayout = () => {
    const auth = useSelector((state) => state.auth);
    const { data, isLoading } = useQuery({
        queryKey: ["getShop"],
        queryFn: getShop,
        retry: 1,
      });
    // if (auth.login) {
    //     if (auth.role != "shipper") {
    //         return <Navigate to={"/"}></Navigate>;
    //     }
    // } else {
    //     return <Navigate to={"/"}></Navigate>;
    // }

    return (
        <>
            {/* <ReportModal show={show} handleSave={handleSave} data={notify ? notify.length : 0}></ReportModal>
            <SellerHeader shop={data}></SellerHeader>
            <Outlet shop={data}></Outlet>
            <SelllerFooter></SelllerFooter> */}
            {
                isLoading ? (
                    <Loading />
                ) : (
                    <ShipperHeader  shop={data}/>
                )
            }
            
        </>
    );

}

export default ShipperLayout