import React, { useState, useCallback, useEffect } from 'react'
import { Card } from 'antd';
import { Form, Input, Button, notification, Tag } from 'antd';
import ScatterChart from './ScatterChart';
import API_PATH from "./Constants/api-paths";
import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { CloseCircleOutlined } from '@ant-design/icons';


const CreateForm = () => {

    const [form] = Form.useForm();
    const [listData, setListData] = useState([])
    const [formData, setFormData] = useState({
        label: '',
        datapoints: [],
        currentX: '',
        currentY: ''
    });

    const handleInputs = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const addPoint = () => {
        if (!formData?.currentX || !formData?.currentY) {
            notification.error({
                message: "Both X and Y coordinates are required to add a point.",
                icon: <ExclamationCircleOutlined style={{ color: "#fff" }} />,
                style: {
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    border: "1px solid #c0392b",
                },
                duration: 5,
                placement: "topRight",
            });
            return;
        }

        if (isNaN(formData?.currentX) || isNaN(formData?.currentY)) {
            notification.error({
                message: "Please enter valid numbers for X and Y coordinates.",
                icon: <ExclamationCircleOutlined style={{ color: "#fff" }} />,
                style: {
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    border: "1px solid #c0392b",
                },
                duration: 5,
                placement: "topRight",
            });
            return;
        }
        

        const newPoint = { x: parseFloat(formData?.currentX), y: parseFloat(formData?.currentY) };
        setFormData(prev => ({
            ...prev,
            datapoints: [...(prev?.datapoints || []), newPoint],
            currentX: '',
            currentY: '',
        }));
        form.resetFields();
    };


    const SubmitForm = async () => {
        let submissionDatapoints = [...(formData?.datapoints || [])];
        if (formData?.currentX && formData?.currentY && !isNaN(formData?.currentX) && !isNaN(formData?.currentY)) {
            submissionDatapoints.push({
                x: parseFloat(formData?.currentX),
                y: parseFloat(formData?.currentY)
            });
        } else if ((formData?.currentX || formData?.currentY) && (isNaN(formData?.currentX) || isNaN(formData?.currentY))) {
            notification.error({
                message: "Please enter valid numbers for the current X and Y coordinates or leave them both blank if you've finished adding points.",
                icon: <ExclamationCircleOutlined style={{ color: "#fff" }} />,
                style: {
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    border: "1px solid #c0392b",
                },
                duration: 5,
                placement: "topRight",
            });
            return;
        }

        const requestBody = {
            label: formData.label,
            datapoints: submissionDatapoints,
        };

        form.resetFields();

        try {
            const res = await fetch(`${API_PATH.CREATE}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const result = await res.json();
            if (result && (result.status === 200 || result?.message === "Chart created successfully")) {
                setFormData({ x: '', y: '', label: '' });
                ChartList();
                notification.success({
                    message: result?.message,
                    icon: <CheckCircleOutlined style={{ color: "#fff" }} />,
                    style: {
                        backgroundColor: "#2ecc71",
                        color: "#fff",
                        border: "1px solid #52c41a",
                    },
                    duration: 5,
                    placement: "topRight",
                });
            } else if (result && result?.message === "Datapoints are required") {
                notification.error({
                    message: result?.message,
                    icon: <ExclamationCircleOutlined style={{ color: "#fff" }} />,
                    style: {
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                        border: "1px solid #c0392b",
                    },
                    duration: 5,
                    placement: "topRight",
                });
            } else {
                notification.error({
                    message: "Error: Something went wrong server error",
                    icon: <ExclamationCircleOutlined style={{ color: "#fff" }} />,
                    style: {
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                        border: "1px solid #c0392b",
                    },
                    duration: 5,
                    placement: "topRight",
                });
            }
        } catch (error) {
            console.log("Error", error);
            notification.error({
                message: "Error: Something went wrong server error",
                icon: <ExclamationCircleOutlined style={{ color: "#fff" }} />,
                style: {
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    border: "1px solid #c0392b",
                },
                duration: 5,
                placement: "topRight",
            });
        }
    };

    const ChartList = useCallback(async () => {

        try {
            const res = await fetch(`${API_PATH.LIST}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await res.json();
            if (result) {
                console.log(result, "resultData");
                setListData(result?.data)
            }
        } catch (error) {
            console.log("Error", error);
        }
    }, []);

    const handleRemovePoint = (indexToRemove) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            datapoints: prevFormData.datapoints.filter((_, index) => index !== indexToRemove),
        }));
    };


    useEffect(() => {
        ChartList()
    }, [ChartList])


    return (
        <div className='container-fluid pb-4 page-bg-selector'>
            <div className='row d-flex justify-content-center align-items-center py-3 px-3'>
                <div className='col-md-5 col-12'>
                    <Card className='create-form'
                    >
                        <Form form={form} layout="vertical" onFinish={SubmitForm} >
                            {formData?.datapoints?.length > 0 && (
                                <div>
                                    <h5>Current Points:</h5>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {formData.datapoints.map((point, index) => (
                                            <Tag
                                                key={index}
                                                closeIcon={<CloseCircleOutlined style={{ color: "red" }} />}
                                                onClose={(e) => {
                                                    e.preventDefault();
                                                    handleRemovePoint(index);
                                                }}
                                                style={{ marginBottom: 8 }}
                                            >
                                                X: {point.x}, Y: {point.y}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="row">
                                <div className="col-md-12">
                                    <Form.Item label="X-coordinate" name="currentX"
                                        rules={[{ required: true, message: 'Please input X-coordinate!' }]}>
                                        <Input placeholder="X-coordinate" name="currentX" value={formData.currentX} onChange={handleInputs} />
                                    </Form.Item>
                                </div>
                                <div className="col-md-12">
                                    <Form.Item label="Y-coordinate"
                                        name="currentY"
                                        rules={[{ required: true, message: 'Please input Y-coordinate!' }]}
                                    >
                                        <Input placeholder="Y-coordinate" name="currentY" value={formData.currentY} onChange={handleInputs} />
                                    </Form.Item>
                                </div>
                                {formData?.currentX && formData?.currentY ? (
                                    <Form.Item>
                                        <Button htmlType="submit" type="text" onClick={addPoint}>
                                            Add more Points
                                        </Button>
                                    </Form.Item>
                                ) : (null)}
                                <div className="col-md-12">
                                    <Form.Item label="Chart Label"
                                        name="label"
                                        rules={[{ required: true, message: 'Please input label!' }]}
                                    >
                                        <Input placeholder="Label" name="label" value={formData?.label} onChange={handleInputs} />
                                    </Form.Item>
                                </div>
                                <Form.Item>
                                    <div class="d-grid col-6 mx-auto">
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    </div>
                                </Form.Item>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>

            <ScatterChart listData={listData} ChartList={ChartList} />
        </div>
    )
}

export default CreateForm