import Chatroom from "@/content/components/chatroom";
import Sidebar from "@/content/components/sidebar";
import "./App.scss";
function App() {
	return (
		<div className="App">
			<Sidebar />
			<Chatroom />
		</div>
	);
}

export default App;
