import { useEffect, useState } from "react";
import {
  notification,
  Pagination,
  Input,
  Select,
  Spin,
  Card,
  Row,
  Col,
  Tag,
  Button,
  InputNumber,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { getAllProducts, getAllProductsBySearch } from "../util/api";

const { Search } = Input;
const { Option } = Select;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pageSize, setPageSize] = useState(8);

  // giá
  const [priceMin, setPriceMin] = useState();
  const [priceMax, setPriceMax] = useState();

  const beUrl = import.meta.env.VITE_BACKEND_URL;

  // Available categories
  const categories = ["Tất cả", "Bóng bàn", "Cầu lông", "Bóng đá", "Bóng rổ"];

  const fetchProducts = async (page = 1, size = pageSize) => {
    setLoading(true);
    try {
      let response;

      if (
        searchQuery ||
        selectedCategory ||
        priceMin !== undefined ||
        priceMax !== undefined
      ) {
        response = await getAllProductsBySearch({
          page,
          limit: size,
          name: searchQuery,
          category: selectedCategory,
          priceMin,
          priceMax,
        });
      } else {
        response = await getAllProducts(page, size, selectedCategory);
      }

      if (response && response.data) {
        setProducts(response.data || []);
        setTotal(response.totalItems || 0);
        setCurrentPage(page);
      } else {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải dữ liệu sản phẩm",
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      notification.error({
        message: "Lỗi",
        description: "Đã xảy ra lỗi khi tải sản phẩm",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [
    currentPage,
    pageSize,
    selectedCategory,
    searchQuery,
    priceMin,
    priceMax,
  ]);
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceMin(undefined);
    setPriceMax(undefined);
    setCurrentPage(1);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShowSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    const categoryValue = category === "Tất cả" ? "" : category;
    setSelectedCategory(categoryValue);
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Bóng bàn": "blue",
      "Cầu lông": "green",
      "Bóng đá": "orange",
      "Bóng rổ": "purple",
    };
    return colors[category] || "default";
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="px-4 py-6 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={6}>
                <Search
                  placeholder="Tìm kiếm sản phẩm..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  onSearch={handleSearch}
                  className="rounded-lg"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  size="large"
                  placeholder="Chọn danh mục"
                  style={{ width: "100%" }}
                  value={selectedCategory || "Tất cả"}
                  onChange={handleCategoryChange}
                  className="rounded-lg"
                >
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Col>

              {/* Price Filter */}
              <Col xs={12} sm={6} md={6}>
                <InputNumber
                  placeholder="Giá từ"
                  min={0}
                  style={{ width: "100%" }}
                  value={priceMin}
                  onChange={setPriceMin}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <InputNumber
                  placeholder="Đến"
                  min={0}
                  style={{ width: "100%" }}
                  value={priceMax}
                  onChange={setPriceMax}
                />
              </Col>

              {/* Reset button */}
              <Col xs={24} sm={24} md={24} className="text-right">
                <Button onClick={handleResetFilters} danger>
                  Reset bộ lọc
                </Button>
              </Col>
            </Row>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <Spin size="large" />
            <p className="mt-6 text-gray-600 text-lg">Đang tải sản phẩm...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="mb-12">
            <Row gutter={[20, 24]}>
              {products.map((product) => (
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
                        type="text"
                        icon={<EyeOutlined />}
                        className="text-blue-600 hover:text-blue-800 px-6"
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
                    {/* Card body với padding tối ưu */}
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
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="flex justify-center pt-8 pb-12">
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="px-8 py-6">
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  onShowSizeChange={handleShowSizeChange}
                  showSizeChanger={true}
                  pageSizeOptions={["8", "12", "16", "24"]}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} trong ${total} sản phẩm`
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
