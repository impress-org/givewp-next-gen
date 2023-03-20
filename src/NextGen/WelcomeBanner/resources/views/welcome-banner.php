<div
    id="givewpNextGenWelcomeBanner"
    style="
        clear: both;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 44px;
        margin: 36px 16px 24px 0;
        padding: 24px 48px 36px;
        border-radius: 8px;
        box-shadow: 0 1px 2px 0 rgba(14, 14, 14, 0.15);
        border: solid 1px var(--givewp-green-800);
        background-color: var(--givewp-shades-white);
        line-height: 1.4;
        color: var(--givewp-grey-900);
    "
>

    <a id="givewpNextGenWelcomeBannerDismiss" href="#" style="position: absolute;top:24px;right:48px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.707 6.707a1 1 0 0 0-1.414-1.414L12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293z" fill="#0E0E0E"/>
        </svg>
    </a>

    <div style="
        display: flex;
        flex-direction: column;
        gap: 44px;
    "
    >
        <header style="display: flex; flex-direction: column; gap: 9px; align-items: start;">
            <div style="
            color: white;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            gap: 4px;
            padding: 2px 8px;
            border-radius: 12px;
            background-color: var(--givewp-orange-400);
        ">
                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.209 1.667a.583.583 0 1 0-1.167 0v.875h-.875a.583.583 0 1 0 0 1.167h.875v.875a.583.583 0 1 0 1.167 0v-.875h.875a.583.583 0 1 0 0-1.167h-.875v-.875zM3.209 10.417a.583.583 0 0 0-1.167 0v.875h-.875a.583.583 0 0 0 0 1.167h.875v.875a.583.583 0 1 0 1.167 0v-.875h.875a.583.583 0 0 0 0-1.167h-.875v-.875zM8.128 2.041a.583.583 0 0 0-1.088 0l-1.012 2.63c-.175.456-.23.587-.306.693-.075.107-.168.2-.274.275-.106.075-.238.13-.693.306l-2.63 1.011a.583.583 0 0 0 0 1.09l2.63 1.01c.455.176.587.231.693.306.106.076.199.169.274.275.076.106.13.237.306.693l1.012 2.63a.583.583 0 0 0 1.088 0l1.012-2.63c.175-.456.23-.587.306-.693.075-.106.168-.2.274-.275.106-.075.238-.13.693-.305l2.63-1.012a.583.583 0 0 0 0-1.089l-2.63-1.011c-.455-.176-.587-.23-.693-.306a1.167 1.167 0 0 1-.274-.275c-.076-.106-.13-.237-.306-.693l-1.012-2.63z" fill="#FFFDF2"/>
                </svg>
                <?php _e('Beta', 'give' ); ?>
            </div>
            <h2 style="
            margin: 6px 0 8px;
            font-size: 24px;
            font-weight: bold;
            line-height: 1.33;
        "><?php _e('Welcome aboard! Help us test the new Visual Donation Form Builder', 'give'); ?></h2>
            <div style="font-size: 16px;"><?php _e('Create the donation form of your dreams using an easy-to-use visual donation form builder', 'give'); ?></div>
        </header>


        <div style="
            display: flex;
            flex-wrap: wrap;
            gap: 73px;
        ">
            <!-- Next Steps -->
            <section style="flex:1;">
                <h2 style="
                    margin: 0;
                    font-size: 18px;
                    color: var(--givewp-blue-500);
                "><?php _e('Next Steps', 'give'); ?></h2>

                <div style="display:flex;flex-direction:column;gap:73px;">

                    <!-- Join the Journey -->
                    <div>
                        <h3 style="font-size: 16px;margin: 12px 0;"><?php _e('Join the journey', 'give'); ?></h3>
                        <p style="font-size: 12px;"><?php _e('Stay informed about Give 3.0 and Next Gen updates', 'give'); ?></p>
                        <form id="givewpNextGenNewsletter" style="display: flex;flex-wrap:wrap;gap:8px;">
                            <input
                                id="givewpNextGenNewsletterEmail"
                                style="
                            flex:3;
                            padding: 12px 24px 12px 16px;
                            border-radius: 2px;
                            border: solid 1px var(--givewp-grey-300);
                            background-color: var(--givewp-shades-white);
                        "
                                type="email"
                                value="<?php echo esc_attr(wp_get_current_user()->user_email); ?>"
                                placeholder="<?php esc_attr_e('Enter your email', 'give'); ?>"
                            />
                            <button type="submit" style="
                        flex: 1;
                        font-size: 14px;
                        color: white;
                        padding: 12px 24px;
                        border-radius: 2px;
                        border: solid 1px var(--givewp-green-500);
                        background-color: var(--givewp-green-500);
                    "><?php _e('Submit', 'give'); ?></button>
                        </form>
                        <div id="givewpNextGenNewsletterSuccess" style="
                        display: none;
                        text-align: center;
                    margin: 12px 0 4px 0;
                    padding: 8px 8px 8px 32px;
                    border-radius: 4px;
                    background-color: var(--givewp-green-25);
                    color: var(--givewp-green-600);
                ">
                            <div style="flex:1;">
                                <?php _e('Subscribed', 'give'); ?>
                            </div>
                        </div>
                    </div>

                    <!-- Create your new donation form -->
                    <div>
                        <h3 style="font-size: 16px;margin: 12px 0;"><?php _e('Create your new donation form', 'give'); ?></h3>
                        <p><?php _e('The Visual donation form building experience is one click away', 'give'); ?></p>
                        <a
                            href="<?php echo admin_url('edit.php?post_type=give_forms&page=form-builder-next-gen'); ?>"
                            style="
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        gap: 8px;
                        padding: 12px 24px 12px 16px;
                        border-radius: 4px;
                        border: solid 1px var(--givewp-green-600);
                        background-color: var(--givewp-shades-white);
                        text-decoration: none;
                        color: var(--givewp-green-600);
                    "
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 4.166v11.667M4.165 9.999h11.667" stroke="#2D802F" stroke-width="1.667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <?php _e('Create a next visual donation form', 'give'); ?>
                        </a>
                        <div style="
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: flex-start;
                    gap: 8px;
                    margin: 12px 0 4px 0;
                    padding: 8px 8px 8px 32px;
                    border-radius: 4px;
                    background-color: var(--givewp-green-25);
                    color: var(--givewp-green-600);
                ">
                            <svg style="margin-top: 2px;" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 .666a7.333 7.333 0 1 0 0 14.667A7.333 7.333 0 0 0 8 .666zm0 4a.667.667 0 1 0 0 1.333h.006a.667.667 0 0 0 0-1.333h-.007zm.666 3.333a.667.667 0 0 0-1.333 0v2.667a.667.667 0 1 0 1.333 0V7.999z" fill="#2D802F"/>
                            </svg>
                            <div style="flex:1;">
                                <?php _e('The Next Gen plugin is intended only for testing and feedback purposes. Please do not use for live donations.', 'give'); ?>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <!-- What's New -->
            <section style="flex:2;">
                <h2 style="
                    margin: 0;
                    font-size: 18px;
                    color: var(--givewp-blue-500);
                "><?php _e('What\'s New', 'give'); ?></h2>

                <div style="
                    margin-top: 8px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 22px;
                "
                >
                    <!-- Design Mode -->
                    <div style="
                        flex: 1;
                        width: 318px;
                        padding: 12px 12px 16px;
                        border-radius: 4px;
                        border: solid 1px var(--givewp-blue-500);
                        background-color: var(--givewp-blue-25);
                    ">
                        <img style="width: 100%;" src="https://placehold.co/450x400?text=Design+Mode" alt="">
                        <h3><?php _e('Design mode', 'give'); ?></h3>
                        <div><?php _e('Toggle the "Design" tab and customize the colors and features of your form based on the Form Design you choose.', 'give'); ?></div>
                    </div>

                    <!-- Custom field support -->
                    <div style="
                        flex: 1;
                        width: 318px;
                        padding: 12px 12px 16px;
                        border-radius: 4px;
                        border: solid 1px var(--givewp-blue-500);
                        background-color: var(--givewp-blue-25);
                    ">
                        <img style="width: 100%;" src="https://placehold.co/450x400?text=Custom+Fields" alt="">
                        <h3><?php _e('Custom field support', 'give'); ?></h3>
                        <div><?php _e('Add custom fields to your form. Drag and drop them where you need, to any section. Even add new drag-and-droppable sections!', 'give'); ?></div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>

<script>
    jQuery(document).ready(function($) {
        $('#givewpNextGenWelcomeBannerDismiss').click(function() {
            $.post(ajaxurl, {
                'action': '<?php echo $action; ?>',
                'nonce': '<?php echo $nonce; ?>',
            }, function(response) {
                $('#givewpNextGenWelcomeBanner').slideUp("slow");
            });
        });
        $('#givewpNextGenNewsletter').submit(function(e) {

            e.preventDefault();

            $('#givewpNextGenNewsletter').slideUp();
            $('#givewpNextGenNewsletterSuccess').show();

            //$.post('https://connect.givewp.com/activecampaign/subscribe', {
            //    action: 'subscribe',
            //    email: $('#givewpNextGenNewsletterEmail').val(),
            //    first_name: '<?php //echo wp_get_current_user()->user_firstname; ?>//',
            //    last_name: '<?php //echo wp_get_current_user()->user_lastname; ?>//',
            //    website_url: '<?php //echo get_bloginfo('url'); ?>//',
            //    website_name: '<?php //echo get_bloginfo('sitename'); ?>//',
            //}, function(response) {
            // });
        })
        console.log( 'ready' );
    });
</script>
