import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login form submitted:', formData);
    // Add your login logic here
  };

  return (
    <main className="main" style={{ paddingTop: '50px' }}>
        <section className="section-box shop-template mt-60">
          <div className="container">
            <div className="row mb-100">
              <div className="col-lg-1"></div>
              <div className="col-lg-5">
                <h3 style={{color: 'black'}}>Member Login</h3>
                <p className="font-md" style={{color: '#333333'}}>Welcome back!</p>
                <div className="form-register mt-30 mb-30">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="mb-5 font-sm" style={{color: '#333333', fontWeight: 'bold'}}>Email / Phone / Username *</label>
                      <input 
                        className="form-control" 
                        type="text" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={{color: 'black'}}
                        onFocus={(e) => e.target.style.setProperty('border-color', '#df2020', 'important')}
                        onBlur={(e) => e.target.style.setProperty('border-color', '', 'important')}
                        required
                      />
          </div>
                    <div className="form-group">
                      <label className="mb-5 font-sm" style={{color: '#333333', fontWeight: 'bold'}}>Password *</label>
                      <input 
                        className="form-control" 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        style={{color: 'black'}}
                        onFocus={(e) => e.target.style.setProperty('border-color', '#df2020', 'important')}
                        onBlur={(e) => e.target.style.setProperty('border-color', '', 'important')}
                        required
                      />
        </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="font-xs" style={{color: '#333333'}}>
                            <input 
                              className="checkagree" 
                              type="checkbox" 
                              name="rememberMe"
                              checked={formData.rememberMe}
                              onChange={handleInputChange}
                              style={{color: 'black'}}
                            />
                            Remember me
                          </label>
      </div>
    </div>
                      <div className="col-lg-6 text-end">
                        <div className="form-group">
                          <Link className="font-xs" style={{color: '#425A8B'}} to="/forgot-password">
                            Forgot your password?
                          </Link>
              </div>
            </div>
                    </div>
                    <div className="form-group">
                      <input 
                        className="font-md-bold btn btn-buy" 
                        type="submit" 
                        value="Sign In"
                      />
                    </div>
                    <div className="mt-20">
                      <span className="font-xs color-gray-500 font-medium">Have not an account?</span>
                      <Link className="font-xs color-brand-3 font-medium" to="/register">
                        Sign Up
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-lg-5"></div>
            </div>
          </div>
        </section>
        
        <section className="section-box box-newsletter">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-7 col-sm-12">
                <h3 className="color-white">Subscribe & Get <span className="color-warning">10%</span> Discount</h3>
                <p className="font-lg color-white">
                  Get E-mail updates about our latest shop and <span className="font-lg-bold">special offers.</span>
                </p>
              </div>
              <div className="col-lg-4 col-md-5 col-sm-12">
                <div className="box-form-newsletter mt-15">
                  <form className="form-newsletter">
                    <input 
                      className="input-newsletter font-xs" 
                      type="email"
                      placeholder="Your email Address"
                    />
                    <button className="btn btn-brand-2" type="submit">Sign Up</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    );
};

export default Login;