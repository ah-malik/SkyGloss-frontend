import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Check, Download, ArrowLeft, Loader2, Package } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import api from "../api/axios";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

export function ReceiptPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            // We'll reuse the verify endpoint or create a get-one endpoint.
            // Since we don't have a direct get-one endpoint in the controller yet (only verify),
            // we might need to add one or filter from my-orders.
            // For efficiency, let's try to verify first which returns status, but we need details.
            // Let's rely on 'my-orders' and find it, or better, add a GetOrder endpoint.
            // For now, let's fetch my-orders and find it client side or add get-by-id to backend.
            // Ideally backend should have get-by-id. I will add it to the backend plan if missing.
            // Wait, I can use verify to ensure it is paid, but I need data.
            // Let's try to fetch all and find for now to avoid backend changes if possible,
            // BUT `my-orders` returns all. It's safer to add `GET /orders/:id` to backend.
            // Checking backend controller... only `my-orders` and `verify`.
            // I will add `GET /orders/:id` to backend for this.
            const res = await api.get(`/orders/${orderId}`);
            setOrder(res.data);
        } catch (error) {
            console.error("Failed to fetch order", error);
            toast.error("Failed to load receipt details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-[#0EA0DC] animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-[#666666]">
                <Package className="w-12 h-12 mb-4 text-gray-400" />
                <p>Order not found</p>
                <Button onClick={() => navigate('/dashboard/shop')} variant="link" className="text-[#0EA0DC]">
                    Return to Shop
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 geometric-bg pt-20 pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="mb-6 flex items-center justify-between">
                        <Button
                            onClick={() => navigate('/dashboard/shop')}
                            variant="ghost"
                            className="text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Shop
                        </Button>
                        <Button
                            variant="outline"
                            className="border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                            onClick={() => window.print()}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Print Receipt
                        </Button>
                    </div>

                    <Card className="skygloss-card p-8 rounded-2xl overflow-hidden print:shadow-none">
                        {/* Success Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h1 className="text-3xl text-[#272727] mb-2">Payment Successful</h1>
                            <p className="text-[#666666]">Thank you for your purchase!</p>
                        </div>

                        <Separator className="my-8" />

                        {/* Order Info */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-sm font-medium text-[#666666] mb-1">Order Number</h3>
                                <p className="text-lg text-[#272727] font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#666666] mb-1">Date</h3>
                                <p className="text-[#272727]">
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#666666] mb-1">Payment Method</h3>
                                <p className="text-[#272727]">Stripe Secure Payment</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#666666] mb-1">Status</h3>
                                <Badge className="bg-green-100 text-green-800 border-0">
                                    {order.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                            <h3 className="text-[#272727] font-medium mb-4">Shipping Details</h3>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-[#666666] mb-1">Sent to:</p>
                                    <p className="text-[#272727] font-medium">
                                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                    </p>
                                    <p className="text-[#272727]">{order.shippingAddress.email}</p>
                                </div>
                                <div>
                                    <p className="text-[#666666] mb-1">Address:</p>
                                    <p className="text-[#272727]">
                                        {order.shippingAddress.address}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                                        {order.shippingAddress.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <h3 className="text-[#272727] font-medium mb-4">Order Items</h3>
                        <div className="space-y-4 mb-8">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                                    <ImageWithFallback
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-12 rounded-lg object-cover bg-gray-50"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-[#272727] font-medium text-sm">{item.name}</h4>
                                        <p className="text-xs text-[#666666]">Size: {item.size}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[#272727] text-sm font-medium">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-[#666666]">{item.quantity} x ${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator className="my-6" />

                        {/* Totals */}
                        <div className="space-y-2 text-right">
                            <div className="flex justify-between">
                                <span className="text-[#666666]">Subtotal</span>
                                <span className="text-[#272727]">${(order.totalAmount - 15 - (order.totalAmount * 0.08)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#666666]">Shipping</span>
                                <span className="text-[#272727]">$15.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#666666]">Tax</span>
                                <span className="text-[#272727]">${(order.totalAmount * 0.08).toFixed(2)}</span>
                                {/* Note: In real app, tax/shipping should be stored exactly in fields. We are estimating for UI now based on our previous logic */}
                            </div>
                            <div className="flex justify-between pt-4 border-t mt-4">
                                <span className="text-lg font-bold text-[#272727]">Total</span>
                                <span className="text-lg font-bold text-[#0EA0DC]">${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8 text-center bg-[#0EA0DC]/5 p-4 rounded-lg">
                            <p className="text-[#0EA0DC] text-sm">
                                A confirmation email has been sent to {order.shippingAddress.email}
                            </p>
                        </div>

                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
