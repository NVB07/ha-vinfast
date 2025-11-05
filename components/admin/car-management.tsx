"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Switch } from "@heroui/switch";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { CarData, CarDetails } from "@/types";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } from "@/lib/cloudinary";

export function CarManagement() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [cars, setCars] = useState<CarData[]>([]);
    const [editingCar, setEditingCar] = useState<CarData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImages, setUploadingImages] = useState<{ [key: number]: boolean }>({});
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<CarData>({
        images: [],
        name: "",
        description: "",
        price: "",
        type: "",
        pinOutstanding: false,
        pinSlider: false,
        details: {
            battery: "",
            power: "",
            range: "",
            seats: "",
            size: "",
            style: "",
            torque: "",
        },
    });

    // Load cars from Firebase
    useEffect(() => {
        const loadCars = async () => {
            try {
                setLoading(true);
                const carsRef = collection(db, "allModels");
                const carsSnap = await getDocs(carsRef);
                const carsData: CarData[] = [];

                carsSnap.forEach((docSnap) => {
                    const data = docSnap.data();
                    carsData.push({
                        id: docSnap.id,
                        ...data,
                        images: data.images || [],
                    } as CarData);
                });

                setCars(carsData);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu xe:", error);
                alert("Không thể tải dữ liệu từ Firestore");
            } finally {
                setLoading(false);
            }
        };

        loadCars();
    }, []);

    const resetForm = () => {
        setFormData({
            images: [],
            name: "",
            description: "",
            price: "",
            type: "",
            pinOutstanding: false,
            pinSlider: false,
            details: {
                battery: "",
                power: "",
                range: "",
                seats: "",
                size: "",
                style: "",
                torque: "",
            },
        });
        setEditingCar(null);
        setIsEditing(false);
        setUploadingImages({});
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsEditing(false);
        onOpen();
    };

    const handleOpenEdit = (car: CarData) => {
        setFormData({
            ...car,
            images: car.images || [],
        });
        setEditingCar(car);
        setIsEditing(true);
        setUploadingImages({});
        onOpen();
    };

    const handleInputChange = (field: keyof CarData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDetailChange = (field: keyof CarDetails, value: string) => {
        setFormData((prev) => ({
            ...prev,
            details: {
                ...prev.details,
                [field]: value,
            },
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Validate all files are images
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.startsWith("image/")) {
                alert("Vui lòng chọn file ảnh");
                return;
            }
        }

        // Upload all files
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const uploadIndex = (formData.images?.length || 0) + i;
            setUploadingImages((prev) => ({ ...prev, [uploadIndex]: true }));

            try {
                const result = await uploadToCloudinary(file, "vinfast/cars", "image");
                setFormData((prev) => ({
                    ...prev,
                    images: [...(prev.images || []), result.url],
                }));
            } catch (error: any) {
                console.error("Lỗi khi tải ảnh:", error);
                alert(error.message || `Không thể tải ảnh ${file.name}`);
            } finally {
                setUploadingImages((prev) => {
                    const newState = { ...prev };
                    delete newState[uploadIndex];
                    return newState;
                });
            }
        }

        // Reset input
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    const handleImageRemove = async (index: number) => {
        if (!formData.images || !formData.images[index]) return;

        const imageUrl = formData.images[index];
        const publicId = extractPublicIdFromUrl(imageUrl);

        // Delete from Cloudinary if it's a Cloudinary URL
        if (publicId) {
            try {
                await deleteFromCloudinary(publicId, "image");
            } catch (error) {
                console.error("Lỗi khi xóa ảnh trên Cloudinary:", error);
            }
        }

        // Remove from form data
        setFormData((prev) => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== index),
        }));
    };

    const handleSave = async () => {
        if (!formData.name || !formData.description || !formData.price) {
            alert("Vui lòng điền các trường bắt buộc: Tên, Mô tả, Giá");
            return;
        }

        try {
            setSaving(true);

            if (isEditing && editingCar && editingCar.id) {
                // Update existing car in Firebase
                const carRef = doc(db, "allModels", editingCar.id);
                await setDoc(carRef, formData, { merge: true });

                // Update local state
                setCars((prev) => prev.map((car) => (car.id === editingCar.id ? { ...formData, id: editingCar.id } : car)));
                alert("Xe đã được cập nhật thành công!");
            } else {
                // Add new car to Firebase
                const docRef = await addDoc(collection(db, "allModels"), formData);

                // Update local state
                const newCar: CarData = {
                    ...formData,
                    id: docRef.id,
                };
                setCars((prev) => [...prev, newCar]);
                alert("Xe đã được thêm thành công!");
            }

            resetForm();
            onClose();
        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error);
            alert("Không thể lưu dữ liệu. Vui lòng thử lại.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa xe này không?")) {
            return;
        }

        try {
            const car = cars.find((c) => c.id === id);

            // Delete all images from Cloudinary
            if (car?.images) {
                for (const imageUrl of car.images) {
                    const publicId = extractPublicIdFromUrl(imageUrl);
                    if (publicId) {
                        try {
                            await deleteFromCloudinary(publicId, "image");
                        } catch (error) {
                            console.error("Lỗi khi xóa ảnh trên Cloudinary:", error);
                        }
                    }
                }
            }

            // Delete from Firebase
            const carRef = doc(db, "allModels", id);
            await deleteDoc(carRef);

            // Update local state
            setCars((prev) => prev.filter((car) => car.id !== id));
            alert("Xe đã được xóa thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa xe:", error);
            alert("Không thể xóa xe. Vui lòng thử lại.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Quản lý xe</h2>
                <Button color="primary" onPress={handleOpenAdd}>
                    Thêm xe
                </Button>
            </div>

            {/* 车辆列表 */}
            <Card>
                <CardBody>
                    <Table aria-label="Danh sách xe">
                        <TableHeader>
                            <TableColumn>Hình ảnh</TableColumn>
                            <TableColumn>Tên</TableColumn>
                            <TableColumn>Loại</TableColumn>
                            <TableColumn>Giá</TableColumn>
                            <TableColumn>Nổi bật trang chủ</TableColumn>
                            <TableColumn>Nổi bật slider</TableColumn>
                            <TableColumn>Thao tác</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"Chưa có dữ liệu xe"}>
                            {cars.map((car) => (
                                <TableRow key={car.id}>
                                    <TableCell>
                                        {car.images?.length > 0 ? (
                                            <img
                                                src={car.images[0]}
                                                alt={car.name}
                                                className="w-16 h-16 object-cover rounded"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/64";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">Không có ảnh</div>
                                        )}
                                    </TableCell>
                                    <TableCell>{car.name}</TableCell>
                                    <TableCell>{car.type}</TableCell>
                                    <TableCell>{car.price}</TableCell>
                                    <TableCell>
                                        <span className={car.pinOutstanding ? "text-green-600" : "text-gray-400"}>{car.pinOutstanding ? "Có" : "Không"}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={car.pinSlider ? "text-green-600" : "text-gray-400"}>{car.pinSlider ? "Có" : "Không"}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" color="primary" variant="flat" onPress={() => handleOpenEdit(car)}>
                                                Sửa
                                            </Button>
                                            <Button size="sm" color="danger" variant="flat" onPress={() => handleDelete(car.id!)}>
                                                Xóa
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            {/* 添加/编辑模态框 */}
            <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader>{isEditing ? "Chỉnh sửa xe" : "Thêm xe"}</ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            {/* 基本信息 */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>

                                <Input
                                    label="Tên"
                                    placeholder="Nhập tên xe"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    variant="bordered"
                                    isRequired
                                />

                                <Textarea
                                    label="Mô tả"
                                    placeholder="Nhập mô tả xe"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    variant="bordered"
                                    isRequired
                                />

                                <Input
                                    label="Giá"
                                    placeholder="Nhập giá"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange("price", e.target.value)}
                                    variant="bordered"
                                    isRequired
                                />

                                <Input
                                    label="Loại"
                                    placeholder="Nhập loại xe"
                                    value={formData.type}
                                    onChange={(e) => handleInputChange("type", e.target.value)}
                                    variant="bordered"
                                />
                            </div>

                            {/* 图片管理 */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Quản lý hình ảnh</h3>

                                <div className="flex gap-2">
                                    <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                                    <Button
                                        color="primary"
                                        variant="flat"
                                        onPress={() => imageInputRef.current?.click()}
                                        isLoading={Object.values(uploadingImages).some((v) => v)}
                                        disabled={Object.values(uploadingImages).some((v) => v)}
                                    >
                                        {Object.values(uploadingImages).some((v) => v) ? "Đang tải..." : "Chọn ảnh"}
                                    </Button>
                                    <span className="text-sm text-gray-500 self-center">Có thể chọn nhiều ảnh</span>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {formData.images?.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image}
                                                alt={`Hình ảnh ${index + 1}`}
                                                className="w-full h-32 object-cover rounded border"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/200";
                                                }}
                                            />
                                            <Button
                                                size="sm"
                                                color="danger"
                                                variant="flat"
                                                className="absolute top-1 right-1"
                                                onPress={() => handleImageRemove(index)}
                                                isDisabled={uploadingImages[index]}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 推荐设置 */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Cài đặt nổi bật</h3>

                                <Switch isSelected={formData.pinOutstanding} onValueChange={(value) => handleInputChange("pinOutstanding", value)}>
                                    Nổi bật trang chủ (Pin Outstanding)
                                </Switch>

                                <Switch isSelected={formData.pinSlider} onValueChange={(value) => handleInputChange("pinSlider", value)}>
                                    Nổi bật slider (Pin Slider)
                                </Switch>
                            </div>

                            {/* 车辆详情 */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Chi tiết xe</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Pin (Battery)"
                                        placeholder="Nhập thông tin pin"
                                        value={formData.details.battery}
                                        onChange={(e) => handleDetailChange("battery", e.target.value)}
                                        variant="bordered"
                                    />

                                    <Input
                                        label="Công suất (Power)"
                                        placeholder="Nhập công suất"
                                        value={formData.details.power}
                                        onChange={(e) => handleDetailChange("power", e.target.value)}
                                        variant="bordered"
                                    />

                                    <Input
                                        label="Tầm hoạt động (Range)"
                                        placeholder="Nhập tầm hoạt động"
                                        value={formData.details.range}
                                        onChange={(e) => handleDetailChange("range", e.target.value)}
                                        variant="bordered"
                                    />

                                    <Input
                                        label="Số ghế (Seats)"
                                        placeholder="Nhập số ghế"
                                        value={formData.details.seats}
                                        onChange={(e) => handleDetailChange("seats", e.target.value)}
                                        variant="bordered"
                                    />

                                    <Input
                                        label="Kích thước (Size)"
                                        placeholder="Nhập kích thước"
                                        value={formData.details.size}
                                        onChange={(e) => handleDetailChange("size", e.target.value)}
                                        variant="bordered"
                                    />

                                    <Input
                                        label="Phong cách (Style)"
                                        placeholder="Nhập phong cách"
                                        value={formData.details.style}
                                        onChange={(e) => handleDetailChange("style", e.target.value)}
                                        variant="bordered"
                                    />

                                    <Input
                                        label="Mô men xoắn (Torque)"
                                        placeholder="Nhập mô men xoắn"
                                        value={formData.details.torque}
                                        onChange={(e) => handleDetailChange("torque", e.target.value)}
                                        variant="bordered"
                                    />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose} isDisabled={saving}>
                            Hủy
                        </Button>
                        <Button color="primary" onPress={handleSave} isLoading={saving} isDisabled={saving}>
                            {saving ? "Đang lưu..." : isEditing ? "Cập nhật" : "Thêm"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
