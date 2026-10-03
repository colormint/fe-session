import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios
            .get('https://jsonplaceholder.typicode.com/userss')
            .then((response) => {
                //strip data
                const formattedData = response.data.map((user) => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    companyName: user.company.name,
                }));
                setUsers(formattedData);
            })
            .catch((error) => {
                console.error('데이터 호출 오류:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // filter user name for search
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    return (
        <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>사용자 목록</h2>

            {/* 검색 입력창 */}
            <input
                type="text"
                placeholder={loading ? '사용자 목록을 불러오는 중...' : '이름으로 검색...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
                style={{
                    width: '100%',
                    padding: '8px 12px',
                    marginBottom: '20px',
                    boxSizing: 'border-box',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    backgroundColor: loading ? '#f1f3f5' : '#fff',
                    cursor: loading ? 'not-allowed' : 'text',
                }}
            />

            {/* 목록 렌더링 */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {loading ? (
                    // 로딩 중 표시할 스켈레톤 플레이스홀더 목록
                    Array.from({ length: 6 }).map((_, index) => (
                        <li
                            key={index}
                            style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '12px',
                                backgroundColor: '#fff',
                            }}
                        >
                            <div
                                className="skeleton"
                                style={{ width: '40%', height: '22px', marginBottom: '10px' }}
                            />
                            <div
                                className="skeleton"
                                style={{ width: '65%', height: '16px', marginBottom: '8px' }}
                            />
                            <div
                                className="skeleton"
                                style={{ width: '50%', height: '14px' }}
                            />
                        </li>
                    ))
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <li
                            key={user.id}
                            style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '12px',
                                backgroundColor: '#fff',
                            }}
                        >
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                {user.name}
                            </div>
                            <div style={{ color: '#555', marginTop: '4px' }}>
                                ✉️ {user.email}
                            </div>
                            <div style={{ color: '#777', fontSize: '0.9rem', marginTop: '4px' }}>
                                🏢 {user.companyName}
                            </div>
                        </li>
                    ))
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </ul>
        </div>
    );
}

export default App;