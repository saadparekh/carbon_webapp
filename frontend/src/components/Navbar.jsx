export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <div className="flex border-b">
      <div
        className={`flex-1 text-center p-4 font-semibold cursor-pointer ${
          activeTab === "plan"
            ? "border-b-4 border-green-600 text-green-600 bg-green-50"
            : "text-gray-600"
        }`}
        onClick={() => setActiveTab("plan")}
      >
        My Action Plan
      </div>
      <div
        className={`flex-1 flex items-center justify-center gap-2 p-4 font-semibold cursor-pointer ${
          activeTab === "chat"
            ? "border-b-4 border-green-600 text-green-600 bg-green-50"
            : "text-gray-600"
        }`}
        onClick={() => setActiveTab("chat")}
      >
        <img
          src="/logo.png"
          alt="EarthMate Logo"
          className="w-6 h-6"
        />
        Ask EarthMate
      </div>
    </div>
  );
}
