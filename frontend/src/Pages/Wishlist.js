import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { 
    getWishlist, 
    removeFromWishlist,
    moveToCart,
    clearWishlist
} from '../Services/wishlistService';
import { Link } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState({
        remove: null,
        move: null,
        clear: false
    });

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!user) return;
            
            try {
                setLoading(true);
                const { success, items, error } = await getWishlist(user._id);
                
                if (success) {
                    setWishlistItems(items);
                    setError('');
                } else {
                    setError(error);
                }
            } catch (err) {
                setError('Failed to load wishlist');
            } finally {
                setLoading(false);
            }
        };
        
        fetchWishlist();
    }, [user]);

    const handleRemoveItem = async (productId) => {
        try {
            setActionLoading({...actionLoading, remove: productId});
            const { success, error } = await removeFromWishlist(user._id, productId);
            
            if (success) {
                setWishlistItems(prev => prev.filter(item => item.productId._id !== productId));
            } else {
                setError(error);
            }
        } catch (err) {
            setError('Failed to remove item');
        } finally {
            setActionLoading({...actionLoading, remove: null});
        }
    };

    const handleMoveToCart = async (productId) => {
        try {
            setActionLoading({...actionLoading, move: productId});
            const { success, error } = await moveToCart(user._id, productId);
            
            if (success) {
                setWishlistItems(prev => prev.filter(item => item.productId._id !== productId));
            } else {
                setError(error);
            }
        } catch (err) {
            setError('Failed to move item to cart');
        } finally {
            setActionLoading({...actionLoading, move: null});
        }
    };

    const handleClearWishlist = async () => {
        try {
            setActionLoading({...actionLoading, clear: true});
            const { success, error } = await clearWishlist(user._id);
            
            if (success) {
                setWishlistItems([]);
            } else {
                setError(error);
            }
        } catch (err) {
            setError('Failed to clear wishlist');
        } finally {
            setActionLoading({...actionLoading, clear: false});
        }
    };

    if (!user) {
        return (
            <div className="wishlist-container unauthorized">
                <h2>My Wishlist</h2>
                <p>Please sign in to view your wishlist</p>
                <Link to="/login" className="auth-link">Sign In</Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="wishlist-container loading">
                <h2>My Wishlist</h2>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="wishlist-container">
            <div className="wishlist-header">
                <h2>My Wishlist</h2>
                {wishlistItems.length > 0 && (
                    <button 
                        onClick={handleClearWishlist}
                        disabled={actionLoading.clear}
                        className="clear-btn"
                    >
                        {actionLoading.clear ? 'Clearing...' : 'Clear All'}
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {wishlistItems.length === 0 ? (
                <div className="empty-wishlist">
                    <p>Your wishlist is empty</p>
                    <Link to="/products" className="browse-btn">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="wishlist-items">
                    {wishlistItems.map((item) => (
                        <div key={item.productId._id} className="wishlist-item">
                            <Link 
                                to={`/products/${item.productId._id}`}
                                className="product-link"
                            >
                                <div className="product-image">
                                    <img 
                                        src={item.productId.image || '/placeholder-product.jpg'} 
                                        alt={item.productId.name}
                                    />
                                </div>
                                <div className="product-info">
                                    <h3>{item.productId.name}</h3>
                                    <p className="price">${item.productId.price.toFixed(2)}</p>
                                    <p className="category">{item.productId.category}</p>
                                </div>
                            </Link>
                            <div className="item-actions">
                                <button
                                    onClick={() => handleMoveToCart(item.productId._id)}
                                    disabled={actionLoading.move === item.productId._id}
                                    className="move-btn"
                                >
                                    {actionLoading.move === item.productId._id ? (
                                        'Moving...'
                                    ) : (
                                        'Move to Cart'
                                    )}
                                </button>
                                <button
                                    onClick={() => handleRemoveItem(item.productId._id)}
                                    disabled={actionLoading.remove === item.productId._id}
                                    className="remove-btn"
                                >
                                    {actionLoading.remove === item.productId._id ? (
                                        'Removing...'
                                    ) : (
                                        'Remove'
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;