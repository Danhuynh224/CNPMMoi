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
  Badge,
  Tooltip,
  Space,
  Divider,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  FireOutlined,
  ClockCircleOutlined,
  StarOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  getAllProducts,
  getAllProductsBySearch,
  toggleFavoriteApi,
} from "../util/api";
import { useNavigate } from "react-router-dom";

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
  const [priceMin, setPriceMin] = useState();
  const [priceMax, setPriceMax] = useState();
  const [viewMode, setViewMode] = useState("all"); // all, viewed, liked
  const [favoriteLoading, setFavoriteLoading] = useState({});

  const beUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const categories = ["Tất cả", "Bóng bàn", "Cầu lông", "Bóng đá", "Bóng rổ"];
  const viewModes = [
    { key: "all", label: "Tất cả sản phẩm", icon: <FilterOutlined /> },
    { key: "viewed", label: "Đã xem", icon: <EyeOutlined /> },
    { key: "liked", label: "Yêu thích", icon: <HeartFilled /> },
  ];

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
        let filteredProducts = response.data || [];

        // Filter based on view mode
        if (viewMode === "viewed") {
          filteredProducts = filteredProducts.filter(
            (product) => product.isViewed
          );
        } else if (viewMode === "liked") {
          filteredProducts = filteredProducts.filter(
            (product) => product.isLike
          );
        }

        setProducts(filteredProducts);
        setTotal(
          viewMode === "all"
            ? response.totalItems || 0
            : filteredProducts.length
        );
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
    viewMode,
  ]);

  const handleToggleFavorite = async (productId) => {
    setFavoriteLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      await toggleFavoriteApi(productId);

      // Update local state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, isLike: !product.isLike }
            : product
        )
      );

      notification.success({
        message: "Thành công",
        description: products.find((p) => p._id === productId)?.isLike
          ? "Đã bỏ khỏi danh sách yêu thích"
          : "Đã thêm vào danh sách yêu thích",
        duration: 2,
      });
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật trạng thái yêu thích",
      });
    } finally {
      setFavoriteLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleViewProduct = async (product) => {
    try {
      // Add view if not already viewed
      if (!product.isViewed) {
        // Update local state
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === product._id ? { ...p, isViewed: true } : p
          )
        );
      }

      navigate(`/products/${product._id}`);
    } catch (error) {
      console.error("Error adding view:", error);
      // Still navigate even if view tracking fails
      navigate(`/products/${product._id}`);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceMin(undefined);
    setPriceMax(undefined);
    setViewMode("all");
    setCurrentPage(1);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) setPageSize(size);
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

  const getViewModeStats = () => {
    const totalProducts = products.length;
    const viewedCount = products.filter((p) => p.isViewed).length;
    const likedCount = products.filter((p) => p.isLike).length;

    return { totalProducts, viewedCount, likedCount };
  };

  const stats = getViewModeStats();

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="px-4 py-6 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* View Mode Selector */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Sản phẩm</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Badge count={stats.totalProducts} showZero color="#1890ff" />
                  Tổng cộng
                </span>
                <span className="flex items-center gap-2">
                  <Badge count={stats.viewedCount} showZero color="#52c41a" />
                  Đã xem
                </span>
                <span className="flex items-center gap-2">
                  <Badge count={stats.likedCount} showZero color="#f5222d" />
                  Yêu thích
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {viewModes.map((mode) => (
                <Button
                  key={mode.key}
                  type={viewMode === mode.key ? "primary" : "default"}
                  icon={mode.icon}
                  onClick={() => {
                    setViewMode(mode.key);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    viewMode === mode.key
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-lg"
                      : "hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {mode.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

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

              <Col xs={24} sm={24} md={24} className="text-right">
                <Button
                  onClick={handleResetFilters}
                  danger
                  className="rounded-lg"
                >
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

        {/* Empty State for Filtered Views */}
        {!loading && products.length === 0 && viewMode !== "all" && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">
              {viewMode === "viewed" ? "👀" : "💝"}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {viewMode === "viewed"
                ? "Chưa có sản phẩm nào được xem"
                : "Chưa có sản phẩm yêu thích"}
            </h3>
            <p className="text-gray-500 mb-6">
              {viewMode === "viewed"
                ? "Hãy khám phá và xem các sản phẩm để chúng xuất hiện ở đây"
                : "Thêm sản phẩm vào danh sách yêu thích để dễ dàng tìm lại sau này"}
            </p>
            <Button
              type="primary"
              onClick={() => setViewMode("all")}
              className="rounded-lg"
            >
              Xem tất cả sản phẩm
            </Button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="mb-12">
            <Row gutter={[20, 24]}>
              {products.map((product) => (
                <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border-0 overflow-hidden group relative"
                    cover={
                      <div
                        className="relative overflow-hidden cursor-pointer"
                        style={{ height: "240px" }}
                        onClick={() => handleViewProduct(product)}
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

                        {/* Status Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.isViewed && (
                            <Badge
                              count={
                                <Tooltip title="Sản phẩm đã xem">
                                  <div className="flex items-center gap-1 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                                    <EyeOutlined />
                                    <span>Đã xem</span>
                                  </div>
                                </Tooltip>
                              }
                            />
                          )}

                          {product.isHot && (
                            <Badge
                              count={
                                <Tooltip title="Sản phẩm hot">
                                  <div className="flex items-center gap-1 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                                    <FireOutlined />
                                    <span>Hot</span>
                                  </div>
                                </Tooltip>
                              }
                            />
                          )}

                          {product.isNew && (
                            <Badge
                              count={
                                <Tooltip title="Sản phẩm mới">
                                  <div className="flex items-center gap-1 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                                    <StarOutlined />
                                    <span>Mới</span>
                                  </div>
                                </Tooltip>
                              }
                            />
                          )}
                        </div>

                        {/* Heart Button */}
                        <div className="absolute top-3 right-3">
                          <Tooltip
                            title={
                              product.isLike
                                ? "Bỏ yêu thích"
                                : "Thêm vào yêu thích"
                            }
                          >
                            <Button
                              type="text"
                              shape="circle"
                              icon={
                                product.isLike ? (
                                  <HeartFilled />
                                ) : (
                                  <HeartOutlined />
                                )
                              }
                              size="large"
                              loading={favoriteLoading[product._id]}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(product._id);
                              }}
                              className={`transition-all duration-300 shadow-lg backdrop-blur-sm ${
                                product.isLike
                                  ? "bg-red-500/90 hover:bg-red-600/90 text-white border-0"
                                  : "bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 border-0"
                              }`}
                            />
                          </Tooltip>
                        </div>

                        {/* Recently Viewed Indicator */}
                        {product.isViewed && (
                          <div className="absolute bottom-3 right-3">
                            <Tooltip title="Xem gần đây">
                              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                <ClockCircleOutlined />
                              </div>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    }
                    actions={[
                      <Button
                        key="view"
                        type="primary"
                        onClick={() => handleViewProduct(product)}
                        className="rounded-lg"
                      >
                        Xem chi tiết
                      </Button>,
                      <Button
                        key="cart"
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-0 rounded-lg"
                      >
                        Thêm giỏ
                      </Button>,
                    ]}
                  >
                    <div className="px-4 py-3" style={{ minHeight: "120px" }}>
                      <div className="flex justify-between items-start mb-4">
                        <h3
                          className="text-base font-semibold text-gray-800 line-clamp-2 flex-1 pr-3 leading-relaxed cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => handleViewProduct(product)}
                        >
                          {product.name}
                        </h3>
                        <Tag
                          color={getCategoryColor(product.category)}
                          className="ml-2 rounded-full text-xs flex-shrink-0 px-3 py-1"
                        >
                          {product.category}
                        </Tag>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-indigo-600">
                          {formatPrice(product.price)}
                        </div>

                        {/* Action Indicators */}
                        <div className="flex items-center gap-2">
                          {product.isLike && (
                            <Tooltip title="Đã thích">
                              <HeartFilled className="text-red-500" />
                            </Tooltip>
                          )}
                          {product.isViewed && (
                            <Tooltip title="Đã xem">
                              <EyeOutlined className="text-green-500" />
                            </Tooltip>
                          )}
                        </div>
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
                  showSizeChanger
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
