import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import { logout } from '../actions/loginActions'
import { browserHistory} from 'react-router';
import styles from '../css/table-form-design.css';

class NavigationBar extends React.Component {
    logout(e){
        e.preventDefault();
        this.props.logout();
    }
    render(){
        const { isAuthenticated, user } = this.props.auth;
        const inhabitantLinks = (
            <div>
                <ul className="right hide-on-med-and-down">
                        <li><a className="dropdown-button"  href="/my_doses" data-activates="dropdown-doses">My doses<i className="mdi-navigation-arrow-drop-down right"></i></a></li>
                        <li><a className="dropdown-button"  href="/change_password" data-activates="dropdown-settings">Settings<i className="mdi-navigation-arrow-drop-down right"></i></a></li>
                        <ul id="dropdown-settings" className="dropdown-content" style={{minWidth:"200px", display: "none", overflow: "hidden", margin:"0", position: "absolute", opacity: "0", maxHeight: "auto"}}> 
                                <li className="collection-item avatar"> 
                                    <a href="#" onClick={this.logout.bind(this)}>
                                        <div id = {styles.block_container}>
                                            <p id={styles.block1} style={{float: "left"}}>
                                                Log out
                                            </p>
                                            <img  id={styles.block2} style={{float: "right"}} src="https://cdn.iconscout.com/public/images/icon/premium/png-512/logout-switch-off-shyt-down-computer-button-38adfb71d7b5b85f-512x512.png" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                        </div>
                                    </a> 
                                </li>
                                <li className="collection-item avatar"> 
                                    <a href="/change_password">
                                        <div id = {styles.block_container}>
                                            <p id={styles.block1} style={{float: "left"}}>
                                                Change
                                                <br/>
                                                password
                                            </p>
                                            <img  id={styles.block2} style={{float: "right"}} src="https://qph.ec.quoracdn.net/main-qimg-c9f2f4fc65d7bbb908de5fc3605dfb98" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                        </div>
                                    </a> 
                                </li>
                        </ul>
                        <ul id="dropdown-doses" className="dropdown-content" style={{minWidth:"200px", display: "none", overflow: "hidden", margin:"0", position: "absolute", opacity: "0", maxHeight: "auto"}}> 
                                <li className="collection-item avatar"> 
                                    <a href="/my_doses">
                                        <div id = {styles.block_container}>
                                            <p id={styles.block1} style={{float: "left"}}>
                                                Show my doses
                                            </p>
                                            <img  id={styles.block2} style={{float: "right"}} src="http://assets.nydailynews.com/polopoly_fs/1.440941.1314586121!/img/httpImage/image.jpg_gen/derivatives/article_750/alg-resize-cough-medicine-jpg.jpg" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                        </div>
                                    </a> 
                                </li>
                        </ul>
                    </ul>
           </div>
        )
        const userLinks = (
            <div>
            <ul className="right hide-on-med-and-down">
                    <li><a className="dropdown-button" href="/persons" data-activates="dropdown-person">Persons<i className="mdi-navigation-arrow-drop-down right"></i></a></li>
                    <li><a className="dropdown-button" href="/storage" data-activates="dropdown-storage">Storage<i className="mdi-navigation-arrow-drop-down right"></i></a></li>
                    <li><a className="dropdown-button" href="/medicine" data-activates="dropdown-medicine">Medicines<i className="mdi-navigation-arrow-drop-down right"></i></a></li>
                    <li><a className="dropdown-button" href="/doses" data-activates="dropdown-dose">Doses<i className="mdi-navigation-arrow-drop-down right"></i></a></li>
                    <li><a className="dropdown-button" href="/cure" data-activates="dropdown-cure">Cures<i className="mdi-navigation-arrow-drop-down right"></i></a></li>
                    <li><a className="dropdown-button" href="/summarization" data-activates="dropdown-summarization">Summarizations<i className="mdi-navigation-arrow-drop-down right"></i></a></li>
                    <li><a className="dropdown-button" href="/settings" data-activates="dropdown-settings">Settings<i className="mdi-navigation-arrow-drop-down right"></i></a></li>
                    <ul id="dropdown-person" className="dropdown-content" style={{minWidth:"200px", display: "none", overflow: "hidden", margin:"0", position: "absolute", opacity: "0", maxHeight: "auto"}}> 
                        <li className="collection-item avatar"> 
                            <a href="/persons" style={{height: "80px"}}> 
                                <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>
                                        New person
                                     </p>
                                     <div style={{float: "right"}}>
                                        <img  id={styles.block2} src="http://www.muecke-rechtsanwalt.de/uploads/ueber_uns_icon.png" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                     </div>
                                </div>
                            </a> 
                        </li>
                    </ul>
                    <ul id="dropdown-storage" className="dropdown-content" style={{minWidth:"200px", display: "none", overflow: "hidden", margin:"0", position: "absolute", opacity: "0", maxHeight: "auto"}}> 
                        <li className="collection-item avatar"> 
                            <a href="/storage" style={{height: "80px"}}> 
                                <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>Upload storage</p>
                                     <div style={{float: "right"}}>
                                        <img  id={styles.block2}  src="http://megaicons.net/static/img/icons_sizes/126/1169/256/button-upload-icon.png" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                     </div>
                                </div>
                            </a> 
                        </li>
                        <li className="collection-item avatar"> 
                            <a href="/storageview" style={{height: "80px"}}>
                                <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>View storage</p>
                                     <div style={{float: "right"}}>
                                        <img  id={styles.block2}  src="http://iits.haverford.edu/wp-content/blogs.dir/1/2015/11/Storage-MAC.jpg" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                     </div>  
                               </div>  
                            </a> 
                        </li>
                    </ul>
                    <ul id="dropdown-medicine" className="dropdown-content" style={{minWidth:"200px", display: "none", overflow: "hidden", margin:"0", position: "absolute", opacity: "0", maxHeight: "auto"}}> 
                        <li className="collection-item avatar"> 
                           <a href="/medicine" style={{height: "80px"}}> 
                                 <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>
                                         New medicine
                                     </p>
                                     <div style={{float: "right"}}>
                                        <img  id={styles.block2} src="http://icons.iconarchive.com/icons/kyo-tux/aeon/256/Sign-Add-icon.png" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                    </div>  
                                </div>  
                           </a> 
                        </li>
                        <li className="collection-item avatar">
                           <a href="/med_unit_prices" style={{height: "80px"}}> 
                                 <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>
                                         Unit prices
                                     </p>
                                     <div style={{float: "right"}}>
                                         <img id={styles.block2}  src="https://lh3.googleusercontent.com/aHXrK_QnDjgl624mwaqSqKxW2CGt15IzldrdFC_JO59p77dQTuwsxGOfMqCt_ZNQCLk=w300" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                    </div>
                                </div>  
                           </a> 
                        </li>
                         <li className="collection-item avatar">
                           <a href="/med_types" style={{height: "80px"}}> 
                                 <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>
                                         New type
                                     </p>
                                     <div style={{float: "right"}}>
                                        <img id={styles.block2} src="http://craftingtype.com/images/crafting-type-logo.png" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                    </div>
                                </div>  
                           </a> 
                        </li>
                    </ul>
                    <ul id="dropdown-summarization" className="dropdown-content" style={{minWidth:"200px", display: "none", overflow: "hidden", margin:"0", position: "absolute", opacity: "0", maxHeight: "auto"}}> 
                        <li className="collection-item avatar"> 
                            <a href="/summarization" style={{height: "80px"}}> 
                                <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>
                                         Total price
                                     </p>
                                     <div style={{float: "right"}}>
                                        <img  id={styles.block2}  src="https://media2.giphy.com/media/l2YOp5fNAFMp63B3a/giphy.gif" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                     </div>
                                </div>
                            </a> 
                        </li>
                        <li className="collection-item avatar"> 
                            <a href="/consumption" style={{height: "80px"}}> 
                                <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>
                                         Total 
                                         <br/>
                                         consumption
                                     </p>
                                      <div style={{float: "right"}}>
                                        <img  id={styles.block2}  src="http://www.contentwire.com/img/3HKvrwFmWpFr-MEz.JPG" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                      </div>
                                </div>
                            </a> 
                        </li>
                    </ul>
                    <ul id="dropdown-settings" className="dropdown-content" style={{minWidth:"200px", display: "none", overflow: "hidden", margin:"0", position: "absolute", opacity: "0", maxHeight: "auto"}}> 
                        <li className="collection-item avatar"> 
                            <a href="#" onClick={this.logout.bind(this)} style={{height: "80px"}}>
                                <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>
                                         Log out
                                     </p>
                                     <div style={{float: "right"}}>
                                        <img  id={styles.block2}  src="https://cdn.iconscout.com/public/images/icon/premium/png-512/logout-switch-off-shyt-down-computer-button-38adfb71d7b5b85f-512x512.png" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                     </div>
                                </div>
                            </a> 
                        </li>
                        <li className="collection-item avatar"> 
                            <a href="/settings" style={{height: "80px"}}>
                                <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>
                                         Settings
                                     </p>
                                     <div style={{float: "right"}}>
                                        <img  id={styles.block2}  src="https://nest.com/support/images/misc-assets-icons/settings-icon.png" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                     </div>
                                </div>
                            </a> 
                        </li>
                        <li className="collection-item avatar"> 
                            <a href="/change_password" style={{height: "80px"}}>
                                <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>
                                         Change
                                         <br/>
                                         password
                                     </p>
                                     <div style={{float: "right"}}>
                                        <img  id={styles.block2}  src="https://qph.ec.quoracdn.net/main-qimg-c9f2f4fc65d7bbb908de5fc3605dfb98" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                     </div>
                                </div>
                            </a> 
                        </li>
                    </ul>
                    <ul id="dropdown-dose" className="dropdown-content" style={{minWidth:"200px", display: "none", overflow: "hidden", margin:"0", position: "absolute", opacity: "0", maxHeight: "auto"}}> 
                        <li className="collection-item avatar"> 
                            <a href="/doses" style={{height: "80px"}}> 
                                <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>
                                        New dose
                                     </p>
                                     <div style={{float: "right"}}>
                                        <img  id={styles.block2}  src="http://assets.nydailynews.com/polopoly_fs/1.440941.1314586121!/img/httpImage/image.jpg_gen/derivatives/article_750/alg-resize-cough-medicine-jpg.jpg" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                     </div>
                                </div>
                            </a> 
                        </li>
                         <li className="collection-item avatar"> 
                            <a href="/dose_simplify" style={{height: "80px"}}> 
                                <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>
                                        More doses
                                     </p>
                                     <div style={{float: "right"}}>
                                        <img  id={styles.block2} style={{float: "right"}} src="https://www.ctvnews.ca/polopoly_fs/1.1138727.1458112006!/httpImage/image.jpeg_gen/derivatives/landscape_620/image.jpeg" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                     </div>
                                </div>
                            </a> 
                        </li>
                    </ul>
                    <ul id="dropdown-cure" className="dropdown-content" style={{minWidth:"200px", display: "none", overflow: "hidden", margin:"0", position: "absolute", opacity: "0", maxHeight: "auto"}}> 
                        <li className="collection-item avatar"> 
                            <a href="/cure" style={{height: "80px"}}> 
                                <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>
                                        New cure
                                     </p>
                                     <div style={{float: "right"}}>
                                        <img  id={styles.block2}  src="http://icons.iconarchive.com/icons/icons8/ios7/512/Healthcare-Treatment-Plan-icon.png" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                     </div>
                                </div>
                            </a> 
                        </li>
                        <li className="collection-item avatar"> 
                            <a href="/cure_settings" style={{height: "80px"}}> 
                                <div id = {styles.block_container}>
                                     <p id={styles.block1} style={{float: "left"}}>
                                        Cure settings
                                     </p>
                                     <div style={{float: "right"}}>
                                        <img  id={styles.block2}  src="https://cdn4.iconfinder.com/data/icons/bold-stroke/512/first_aid_go_kit-512.png" alt="" style={{width:"50px", height:"50px"}}  className="circle"/> 
                                     </div>
                                </div>
                            </a> 
                        </li>
                    </ul>
            </ul>
            </div>
        );
        const guestLinks = (
           <ul className="right hide-on-med-and-down">
                <li> <a href="/signin"> Sign in </a> </li>
                <li> <a href="/signup"> Sign up </a> </li>
           </ul>
        );
        var choosedLinks;
        if (!isAuthenticated){
           choosedLinks = (
               guestLinks
           )
        } else if (this.props.auth.user.alvl == "inhabitant"){
            choosedLinks = (
                inhabitantLinks
            )
        } else {
            choosedLinks = (
                userLinks
            )
        }
        return(
            <div>
                <nav className="green">
                    <div className="nav-wrapper green darken-3">
                        <a href="/" className="brand-logo"> Nursing homes - Lókod </a>
                        {choosedLinks}
                    </div>
                </nav>
            </div>
        );
    }
}

NavigationBar.propTypes = {
    auth: React.PropTypes.object.isRequired,
    logout: React.PropTypes.func.isRequired
}

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}
export default connect(mapStateToProps, { logout }) (NavigationBar);