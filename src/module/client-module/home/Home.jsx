import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "./home.scss";
import { Container, Row, Col } from "react-bootstrap"; // Thêm Row và Col để tạo cấu trúc lưới
import { Box } from "@mui/material";
import CategoryNav from "./CategoryNav";
import ProductList from "./ProductList";
import { useQuery } from "@tanstack/react-query";
import { getHomeProduct } from "../../../api/homeApi";
import Loading from "../loading/Loading";
import CHUSInfo from "./About";
import BrandShowcase from "./Branch";
import { fetch } from "../../../api/Fetch";
const Home = () => {
    const [banners, setBanners] = useState([]);
    useEffect(() => {
        fetchBanners();
    }, []);
    const fetchBanners = async () => {
        try {
            const response = await fetch.get("/banners/all");
            setBanners(response.data);
        } catch (error) {
            console.error("Failed to fetch banners", error);
        }
    };
    const { data, isLoading } = useQuery({
        queryKey: ["product-home"],
        queryFn: getHomeProduct,
    });

    if (isLoading) {
        return <Loading></Loading>;
    }
    return (
        <div id="home-page" style={{ paddingBottom: "200px" }}>
            <CategoryNav />
            <Container style={{ width: "80%" }}>
                <Box sx={{ mt: 5 }}>
                    <Carousel style={{ width: "100%" }} interval={3000}>
                        {/* <Carousel.Item>
              <img
                style={{ width: "100%", height: "420px", objectFit: "cover" }}
                src="https://static.chus.vn/images/promo/279/Pc_CHUSCHOOSE_Vie.jpg"
                alt=""
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                style={{ width: "100%", height: "420px", objectFit: "cover" }}
                src="https://static.chus.vn/images/promo/283/Pc_TeacherDayGift_Vi.jpg"
                alt=""
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                style={{ width: "100%", height: "420px", objectFit: "cover" }}
                src="https://static.chus.vn/images/promo/283/Pc_BagCollection_Vie.jpg"
                alt=""
              />
            </Carousel.Item> */}
                        {banners.map((banner) => (
                            <Carousel.Item key={banner.id}>
                                <img
                                    style={{
                                        width: "100%",
                                        height: "420px",
                                        objectFit: "cover",
                                    }}
                                    src={banner.image}
                                    alt={banner.title || "Banner"}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Box>
                {data.map((item) => {
                    return (
                        <ProductList
                            products={item.products}
                            category={item.name}
                            id={item.id}
                        ></ProductList>
                    );
                })}

                <CHUSInfo></CHUSInfo>
            </Container>
        </div>
    );
};

export default Home;
