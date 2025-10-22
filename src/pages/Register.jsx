import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    rePassword: '',
    agreeTerms: false
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
    console.log('Register form submitted:', formData);
    // Add your registration logic here
  };

  return (
    <main className="main">
      <section className="section-box shop-template mt-60">
        <div className="container">
          <div className="row mb-100">
            <div className="col-lg-1"></div>
            <div className="col-lg-5">
              <h3 style={{color: 'black'}}>Create an account</h3>
              <p className="font-md" style={{color: '#333333'}}>Access to all features. No credit card required.</p>
              <div className="form-register mt-30 mb-30">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="mb-5 font-sm" style={{color: '#333333', fontWeight: 'bold'}}>Full Name *</label>
                    <input 
                      className="form-control" 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Steven job"
                      style={{color: 'black'}}
                      onFocus={(e) => e.target.style.setProperty('border-color', '#df2020', 'important')}
                      onBlur={(e) => e.target.style.setProperty('border-color', '', 'important')}
                      required
                    />
          </div>
                  <div className="form-group">
                    <label className="mb-5 font-sm" style={{color: '#333333', fontWeight: 'bold'}}>Email *</label>
                    <input 
                      className="form-control" 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="stevenjob@gmail.com"
                      style={{color: 'black'}}
                      onFocus={(e) => e.target.style.setProperty('border-color', '#df2020', 'important')}
                      onBlur={(e) => e.target.style.setProperty('border-color', '', 'important')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="mb-5 font-sm" style={{color: '#333333', fontWeight: 'bold'}}>Username *</label>
                    <input 
                      className="form-control" 
                      type="text" 
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="stevenjob"
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
                      placeholder="******************"
                      style={{color: 'black'}}
                      onFocus={(e) => e.target.style.setProperty('border-color', '#df2020', 'important')}
                      onBlur={(e) => e.target.style.setProperty('border-color', '', 'important')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="mb-5 font-sm" style={{color: '#333333', fontWeight: 'bold'}}>Re-Password *</label>
                    <input 
                      className="form-control" 
                      type="password" 
                      name="rePassword"
                      value={formData.rePassword}
                      onChange={handleInputChange}
                      placeholder="******************"
                      style={{color: 'black'}}
                      onFocus={(e) => e.target.style.setProperty('border-color', '#df2020', 'important')}
                      onBlur={(e) => e.target.style.setProperty('border-color', '', 'important')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="font-xs" style={{color: '#333333'}}>
                      <input 
                        className="checkagree" 
                        type="checkbox" 
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        style={{color: 'black'}}
                        required
                      />
                      By clicking Register button, you agree our terms and policy,
                    </label>
                  </div>
                  <div className="form-group">
                    <input 
                      className="font-md-bold btn btn-buy" 
                      type="submit" 
                      value="Sign Up"
                      style={{height: '50px', paddingLeft: '20px', paddingRight: '20px'}}
                    />
                  </div>
                  <div className="mt-20">
                    <span className="font-xs font-medium" style={{color: '#333333'}}>Already have an account?</span>
                    <Link className="font-xs font-medium" style={{color: '#425A8B'}} to="/login">
                      Sign In
                    </Link>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="box-login-social pt-65 pl-50">
                <h5 className="text-center" style={{color: 'black'}}>Use Social Network Account</h5>
                <div className="box-button-login mt-25">
                  <a className="btn btn-login font-md-bold mb-15" style={{color: '#425A8B'}}>
                    Sign up with<img src="assets/imgs/page/account/google.svg" alt="Ecom" />
                  </a>
                  <a className="btn btn-login font-md-bold mb-15" style={{color: '#425A8B'}}>
                    Sign up with<span className="font-md-bold" style={{color: '#1877F2'}}> Facebook</span>
                  </a>
                  <a className="btn btn-login font-md-bold mb-15" style={{color: '#425A8B'}}>
                    Sign up with<img src="assets/imgs/page/account/amazon.svg" alt="Ecom" />
                  </a>
                </div>
                <div className="mt-10 text-center">
                  <span className="font-xs" style={{color: '#333333'}}>Buying for work?</span>
                  <a className="font-xs" style={{color: '#425A8B'}} href="#">
                    Create a free business account
                  </a>
                </div>
              </div>
            </div>
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

export default Register;