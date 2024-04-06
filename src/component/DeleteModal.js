import React from 'react';
import { Modal, notification } from 'antd';
import API_PATH from "../Constants/api-paths";
import {
  CheckCircleOutlined,
} from '@ant-design/icons';

const EditDeleteModal = ({ isModalOpen, handleOk, handleCancel, chartId, ChartList }) => {

  console.log(chartId, "chartId");

  const handleDeleteCard = async () => {
    console.log("Deleting data point:");
    try {

      const finalRes = await fetch(`${API_PATH.DELETE}/${chartId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (finalRes) {
        await ChartList();
        notification.success({
          message: "Chart deleted successfully.",
          icon: <CheckCircleOutlined style={{ color: "#fff" }} />,
          style: {
            backgroundColor: "#2ecc71",
            color: "#fff",
            border: "1px solid #52c41a",
          },
          duration: 5,
          placement: "topRight",
        });
      }
    } catch (error) {
      console.log("delete datapoint error", error)
    }
  };

  return (
    <Modal title="Are You Sure?" open={isModalOpen} onOk={() => {
      handleOk();
      handleDeleteCard()
    }} onCancel={handleCancel}>
      <p>Are you sure you want to proceed with the fix?</p>
      <p>This action will attempt to correct the configuration and cannot be undone.</p>
    </Modal>
  );
};

export default EditDeleteModal;
