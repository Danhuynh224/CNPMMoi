import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Tag, Spin, Col, Row } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import {
  getDetailProduct,
  getRelatedProductsApi,
  toggleFavoriteApi,
  getProductStatsApi,
  addViewApi,
} from "../util/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [stats, setStats] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const beUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const productData = await getDetailProduct(id);
        setProduct(productData);

        const relatedData = await getRelatedProductsApi(id);
        setRelated(relatedData);

        const statsData = await getProductStatsApi(id);
        setStats(statsData);

        await addViewApi(id);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleFavorite = async () => {
    try {
      await toggleFavoriteApi(id);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const getCategoryColor = (category) => {
    const colors = {
      "Bóng bàn": "blue",
      "Cầu lông": "green",
      "Bóng đá": "orange",
      "Bóng rổ": "purple",
    };
    return colors[category] || "default";
  };

  if (!product) return <Spin size="large" className="m-20" />;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Main product */}
      <Card className="max-w-5xl mx-auto shadow-lg rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image left */}
          <div className="flex-shrink-0 w-full md:w-1/3 h-64 flex justify-center items-center overflow-hidden rounded-xl">
            {
              <div
                className="relative overflow-hidden"
                style={{ height: "240px", width: "420px" }}
              >
                <img
                  alt={product.name}
                  src={beUrl + product.image}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    width: "100%",
                    height: "100%",
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<HeartOutlined />}
                    size="small"
                    className="bg-white text-red-500 border-0 shadow-lg hover:bg-red-50"
                  />
                </div>
              </div>
            }
            <div className="absolute top-4 right-4">
              <Button
                type="primary"
                shape="circle"
                icon={<HeartOutlined />}
                size="large"
                className={`bg-white border-0 ${
                  isFavorite ? "text-red-500" : "text-gray-500"
                }`}
                onClick={handleFavorite}
              />
            </div>
          </div>

          {/* Info right */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <Tag color={getCategoryColor(product.category)} className="mb-2">
                {product.category}
              </Tag>
              <p className="text-red-500 font-semibold text-xl mb-4">
                {formatPrice(product.price)}
              </p>
              <div>
                <h3 className="font-semibold mb-1">Thống kê</h3>
                <p className="text-sm">Lượt xem: {product.viewsCount ?? 0}</p>
                <p className="text-sm">Lượt thích: {product.likesCount ?? 0}</p>
                <p className="text-sm">Lượt mua: {stats.purchases ?? 0}</p>
                <p className="text-sm">Lượt bình luận: {stats.comments ?? 0}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                type="primary"
                size="middle"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Related products */}
      <div className="mb-12">
        <Row gutter={[20, 24]}>
          {related.map((product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border-0 overflow-hidden group"
                cover={
                  <div
                    className="relative overflow-hidden"
                    style={{ height: "240px" }}
                  >
                    <img
                      alt={product.name}
                      src={beUrl + product.image}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<HeartOutlined />}
                        size="small"
                        className="bg-white text-red-500 border-0 shadow-lg hover:bg-red-50"
                      />
                    </div>
                  </div>
                }
                actions={[
                  <Button
                    key="view"
                    type="primary"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    Xem
                  </Button>,
                  <Button
                    key="cart"
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:from-blue-600 hover:to-indigo-700 px-6"
                  >
                    Mua
                  </Button>,
                ]}
              >
                {/* Card body */}
                <div className="px-4 py-3" style={{ minHeight: "120px" }}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2 flex-1 pr-3 leading-relaxed">
                      {product.name}
                    </h3>
                    <Tag
                      color={getCategoryColor(product.category)}
                      className="ml-2 rounded-full text-xs flex-shrink-0 px-3 py-1"
                    >
                      {product.category}
                    </Tag>
                  </div>
                  <div className="text-xl font-bold text-indigo-600 mt-auto">
                    {formatPrice(product.price)}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default ProductDetail;
