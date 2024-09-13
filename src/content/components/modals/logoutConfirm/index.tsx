import { Modal, Button } from "antd";
type propTypes = {
	open: boolean;
	handleOk: () => void;
	handleCancel: () => void;
};
export default function LogoutConfirm({
	open,
	handleOk,
	handleCancel,
}: propTypes) {
	return (
		<>
			<Modal
				open={open}
				title="Confirm Logout"
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button
						key="cancel"
						onClick={handleCancel}
					>
						Cancel
					</Button>,
					<Button
						key="confirm"
						onClick={handleOk}
						type="primary"
						danger
					>
						Confirm
					</Button>,
				]}
			>
				<p>Are you sure you want to logout?</p>
			</Modal>
		</>
	);
}
