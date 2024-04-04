import React from 'react'
import { Card } from 'antd';
import { Form, Input, Button } from 'antd';
import ScatterChart from './ScatterChart';

const CreateForm = () => {

    const [form] = Form.useForm();

    const onFinish = (values) => {
        // onSubmit(values);
        form.resetFields();
    };

    return (
        <div className='container-fluid pb-4 page-bg-selector'>
            <div className='row d-flex justify-content-center align-items-center py-3'>
                <div className='col-md-5 col-12'>
                    <Card className='create-form'
                    >
                        <Form form={form} layout="vertical" onFinish={onFinish} >
                            <h4>Fill form</h4>
                            <div className="row">
                                <div className="col-md-12">
                                    <Form.Item label="X-coordinate" name="x"
                                        rules={[{ required: true, message: 'Please input X-coordinate!' }]}>
                                        <Input placeholder="X-coordinate" />
                                    </Form.Item>
                                </div>
                                <div className="col-md-12">
                                    <Form.Item label="Y-coordinate"
                                        name="y"
                                        rules={[{ required: true, message: 'Please input Y-coordinate!' }]}
                                    >
                                        <Input placeholder="Y-coordinate" />
                                    </Form.Item>
                                </div>
                                <div className="col-md-12">
                                    <Form.Item label="Label"
                                        name="label"
                                        rules={[{ required: true, message: 'Please input label!' }]}
                                    >
                                        <Input placeholder="Label" />
                                    </Form.Item>
                                </div>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>

            <ScatterChart />
        </div>
    )
}

export default CreateForm