import React from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/sidebar/AdminSidebar";

const AdminLayout: React.FC = () => {
    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ colorScheme: 'light', background: '#0f172a', color: '#1e293b' }}>
            <AdminSidebar />
            
            <main className="flex-1 w-full h-full overflow-auto" style={{ background: '#f1f5f9', color: '#1e293b' }}>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;