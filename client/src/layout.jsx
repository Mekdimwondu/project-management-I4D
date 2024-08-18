import { Outlet, Link, NavLink } from "react-router-dom";

function Layout() {
  // Fetch the user data from localStorage
  const storedUser = localStorage.getItem('User');
  const user = storedUser ? (storedUser) : null;

  const isAdmin = user && user.role === 'Admin';

  return (
    <section className="flex h-screen overflow-hidden">
    <aside className="w-1/5 bg-blue p-4 overflow-y-auto">
      <Link to="/" className="text-white font-extrabold text-2xl">
        <h1>IMPACT<br />FOR <br />DEVELOPMENT</h1>
      </Link>
      <nav className="mt-10">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) =>
            `block mb-5 w-full px-4 py-2 font-semibold border border-transparent rounded-l-lg 
            ${isActive ? 'bg-white text-blue font-bold' : 'text-white'} 
            hover:border-white hover:ring-offset-2 focus:outline-none focus:ring-2 focus:text-blue-600 focus:font-bold transition-colors duration-200`
          }
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/project" 
          className={({ isActive }) =>
            `block mb-5 w-full px-4 py-2 font-semibold border border-transparent rounded-l-lg 
            ${isActive ? 'bg-white text-blue font-bold' : 'text-white'} 
            hover:border-white hover:ring-offset-2 focus:outline-none focus:ring-2 focus:text-blue-600 focus:font-bold transition-colors duration-200`
          }
        >
          Project
        </NavLink>
        <NavLink 
          to="/message" 
          className={({ isActive }) =>
            `block mb-5 w-full px-4 py-2 font-semibold border border-transparent rounded-l-lg 
            ${isActive ? 'bg-white text-blue font-bold' : 'text-white'} 
            hover:border-white hover:ring-offset-2 focus:outline-none focus:ring-2  focus:text-blue-600 focus:font-bold transition-colors duration-200`
          }
        >
          Message
        </NavLink>
        {isAdmin && (
          <NavLink 
            to="/users" 
            className={({ isActive }) =>
              `block mb-5 w-full px-4 py-2 font-semibold border border-transparent rounded-l-lg 
              ${isActive ? 'bg-white text-blue font-bold' : 'text-white'} 
              hover:border-white hover:ring-offset-2 focus:outline-none focus:ring-2  focus:text-blue-600 focus:font-bold transition-colors duration-200`
            }
          >
            Users
          </NavLink>
        )}
        <NavLink 
          to="/setting" 
          className={({ isActive }) =>
            `block mb-5 w-full px-4 py-2 font-semibold border border-transparent rounded-l-lg 
            ${isActive ? 'bg-white text-blue font-bold' : 'text-white'} 
            hover:border-white hover:ring-offset-2 focus:outline-none focus:ring-2  focus:text-blue-600 focus:font-bold transition-colors duration-200`
          }
        >
          Setting
        </NavLink>
      </nav>
    </aside>
    <div className="w-4/5 bg-background overflow-y-auto">
      <Outlet />
    </div>
  </section>
  );
}

export default Layout;
