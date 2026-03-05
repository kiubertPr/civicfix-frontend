import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import * as pointService from "../../../backend/userService";

import { Home } from "../../app";
import { Pager, BackLink } from "../../common";
import users from "../../users";

const PointHistory = () => {
    const user = useSelector(users.selectors.getUser);
    const scrollRef = useRef(null);
    const [points, setPoints] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);

    const handlePageSizeChange = (newSize) => {
            setSize(newSize)
            setPage(0) 
        }

    const getreasonText = (reason) => {
        switch (reason) {
            case "CREATE_POST":
                return "Creación de publicación";
            case "DAILY_LOGIN":
                return "Inicio de sesión diario";
            case "RECEIVE_VOTE":
                return "Has recibido un voto";
            case "CAST_VOTE":
                return "Has votado en una publicación";
            case "PARTICIPATE_SURVEY":
                return "Participación en encuesta";
            case "CHANGE_POINTS":
                return "Canjeo de puntos";
            default:
                return reason;
        }
    }

    
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [page, size]);

    useEffect(() => {
        if (!user) return;

        pointService.getUserPointsHistory(
        page,
        size,
        (data) => {
            setPoints(data);
            setError(null);
        },
        () => {
            setError("Error al cargar el historial de puntos.");
        }
        );
    }, [page, size, user]);

  return (
    <Home>
        <div className="xl:w-5/8 lg:w-3/5 mt-15 lg:mt-0 md:w-4/5 w-full flex flex-col p-6">
            <BackLink size={20} />
            <h1 className="text-2xl font-bold text-white mt-4 mb-6">Historial de Puntos</h1>
            <h3 className="text-lg text-gray-400 mb-4"> Tus puntos: <span className="text-amber-500">{user.points}</span></h3>
            <div ref={scrollRef} className="lg:mt-2 p-4 lg:p-0 space-y-4 overflow-y-auto scroll-auto scroll no-scrollbar">
                {
                    points.length === 0 ? 
                        (<div className="text-gray-400 text-center py-8">Todavía no has obtenido puntos</div>) 
                        : 
                        (points.content.map((pointT) => (
                            <div key={pointT.id} className="bg-gray-800 p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-white">{getreasonText(pointT.reason)}</span>
                                    <span className={`${pointT.points > 0? "text-green-400" : "text-red-400"}`}>{pointT.points} puntos</span>
                                </div>
                                <div className="text-gray-500 text-sm mt-2">
                                    {new Date(pointT.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        )))
                }
                {points.totalPages > 1 && (
                <Pager
                    page={page}
                    totalPages={points.totalPages}
                    size={size}
                    onPageChange={setPage}
                    onSizeChange={handlePageSizeChange}
                />
                )}
            </div>
        </div>
    </Home>
  );
};

export default PointHistory;
